import fs from 'fs'
import path from 'path'
import puppeteer, { Browser, Viewport } from 'puppeteer'

import { LensCriticalError } from '@/errors'
import { ExitCode } from '@/exit-code'
import type {
	ArgumentParser,
	LensArguments,
	LensConfig,
	LensDependencies,
	Logger,
	ParsedLensArguments,
	RulesetParser,
	RulesetValidator
} from '@/typings/types'
import { arrayToChunks, forEachAsync } from '@/util'

export default class Lens {
	private readonly argumentParser: ArgumentParser
	private browser: Browser | undefined
	private readonly logger: Logger
	private readonly rulesetParser: RulesetParser
	private readonly rulesetValidator: RulesetValidator

	private args: ParsedLensArguments
	private config: LensConfig

	public constructor (dependencies: LensDependencies, args: LensArguments, config: LensConfig) {
		this.argumentParser = dependencies.argumentParser
		this.logger = dependencies.logger
		this.rulesetParser = dependencies.rulesetParser
		this.rulesetValidator = dependencies.rulesetValidator

		this.args = this.argumentParser.parse(args)
		this.config = config

		this.overrideConfigFromFlags()
		this.createOutputDirectory()
	}

	/**
	 * Instantiate browser.
	 * It cannot be done in the constructor since constructor cannot be marked as async.
	 */
	public async init (): Promise<void> {
		this.browser = await puppeteer.launch({
			headless: this.config.puppeteer.headless
		})
	}

	/**
	 * Run lens
	 */
	public async run (): Promise<void> {
		if (!this.browser) {
			throw new LensCriticalError(
				'Lens has not been initialized. Please run "init" before running.',
				ExitCode.BrowserNotInitialized
			)
		}

		if (this.args.urls.length > 0) {
			await this.runFromArgs()
		} else {
			await this.runFromRuleset()
		}
	}

	/**
	 * Run lens from specified ruleset
	 *
	 * @private
	 */
	async runFromRuleset (): Promise<void> {
		if (!fs.existsSync(this.config.directories.input)) {
			throw new LensCriticalError(
				`Input directory ${this.config.directories.input} does not exist.`,
				ExitCode.InvalidInputDirectory
			)
		}

		for (const file of fs.readdirSync(this.config.directories.input)) {
			const rawRuleset = await import(path.join(this.config.directories.input, file))
			const validatedRuleset = await this.rulesetValidator.validate(rawRuleset.default, file)
			const parsedRuleset = this.rulesetParser.parse(validatedRuleset)

			if (!parsedRuleset.disable) {
				await forEachAsync(parsedRuleset.rules, async rule => {
					this.logger.header(`Running lens for ${rule.url}`)

					const directory = this.createDirectoryForUrl(rule.url, rule.tag)
					await this.generateScreenshots(rule.url, directory, rule.renderFor)
				})
			} else {
				this.logger.info(`Ruleset ${file} disabled. Skipping.`)
			}
		}
	}

	/**
	 * Run lens from CLI arguments
	 *
	 * @private
	 */
	async runFromArgs (): Promise<void> {
		await forEachAsync(this.args.urls, async url => {
			this.logger.header(`Running lens for ${url.href}`)

			const directory = this.createDirectoryForUrl(url, this.args.tag)
			await this.generateScreenshots(url, directory, this.args.viewportSet)
		})
	}

	/**
	 * Create directory where screenshots of the specified url will be stored
	 *
	 * @param url URL for which directory should be created
	 * @param tag Optional tag which will be used as name for the subdirectory
	 * @private
	 */
	private createDirectoryForUrl (url: URL, tag = ''): string {
		let directory = `${this.config.directories.output}/${url.host}`
		if (tag) {
			directory = `${directory}/${tag}`
		}

		if (!fs.existsSync(directory)) {
			try {
				fs.mkdirSync(directory, { recursive: true })
				this.logger.info(`Created ${directory}`)
			} catch {
				throw new LensCriticalError(
					`Could not create directory ${directory}`,
					ExitCode.CouldNotCreateDirectory
				)
			}
		}

		return directory
	}

	/**
	 * Create output directory if it does not exist
	 *
	 * @private
	 */
	private createOutputDirectory (): void {
		if (!fs.existsSync(this.config.directories.output)) {
			try {
				fs.mkdirSync(this.config.directories.output, { recursive: true })

				this.logger.info(`Created ${this.config.directories.output}`)
			} catch (e) {
				throw new LensCriticalError(
					`Could not create output directory (${this.config.directories.output})`,
					ExitCode.CouldNotCreateDirectory
				)
			}
		}
	}

	/**
	 * Generate screenshots based on the specified arguments
	 *
	 * @param url URL of the page for which screenshots will be generated
	 * @param dir Directory where screenshots will be stored
	 * @param viewportSet Set of viewports to generate screenshots for
	 * @private
	 */
	private async generateScreenshots (url: URL, dir: string, viewportSet: Record<string, Array<Viewport>>): Promise<void> {
		if (!this.browser) {
			throw new LensCriticalError(
				'Browser has not been initialized.',
				ExitCode.BrowserNotInitialized
			)
		}

		for (const [key, viewports] of Object.entries(viewportSet)) {
			const chunks = arrayToChunks(viewports, this.config.chunkSize)

			await forEachAsync(chunks, async chunk => {
				await Promise.all(chunk.map(async viewport => {
					const tag = key === 'default' ? '' : `[${key}] ` // Do not remove space at the end
					await this.generateScreenshot(dir, tag, url, viewport)
				}))
			})
		}
	}

	/**
	 * Generate single screenshot
	 *
	 * @param dir Directory where screenshot will be stored
	 * @param tag Viewport set tag name
	 * @param url URL of the page for which screenshot will be generated
	 * @param viewport Viewport for which screenshot will be generated
	 * @private
	 */
	private async generateScreenshot (
		dir: string,
		tag: string,
		url: URL,
		viewport: Viewport
	): Promise<void> {
		if (!this.browser) {
			throw new LensCriticalError(
				'Lens has not been initialized. Please run "init" before running.',
				ExitCode.BrowserNotInitialized
			)
		}

		const page = await this.browser.newPage()

		await page.setViewport({ ...viewport })
		await page.goto(url.href, { waitUntil: this.config.puppeteer.waitUntil })
		await page.screenshot({ path: `${dir}/${tag}${viewport.width}x${viewport.height}.png` })
		await page.close()

		this.logger.success(`${url.host} ${viewport.width}x${viewport.height}`)
	}

	/**
	 * Override some config values if there are present in the command line arguments
	 *
	 * @private
	 */
	private overrideConfigFromFlags (): void {
		if (this.args.outputDir) {
			this.config.directories.output = this.args.outputDir
		}

		if (this.args.inputDir) {
			this.config.directories.input = this.args.inputDir
		}
	}

	/**
	 * Do the cleanup
	 */
	public async dispose (): Promise<void> {
		await this.browser?.close()
	}
}
