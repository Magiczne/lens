import fs from 'fs'
import path from 'path'
import puppeteer, { Browser, Viewport } from 'puppeteer'

import ExitCode from '@/exit-code'
import {
	ArgumentParser,
	LensArguments,
	LensConfig,
	LensDependencies,
	Logger,
	ParsedLensArguments,
	RulesetParser,
	RulesetValidator
} from '@/typings/types'
import { arrayToChunks, forEachAsync } from '@/utils'
import { LensCriticalError } from '@/errors'

export default class Lens {
	private readonly argumentParser: ArgumentParser
	private browser: Browser | undefined
	private readonly logger: Logger
	private readonly rulesetParser: RulesetParser
	private readonly rulesetValidator: RulesetValidator

	private args: ParsedLensArguments
	private config: LensConfig

	public constructor ({ argumentParser, logger, rulesetParser, rulesetValidator }: LensDependencies) {
		this.argumentParser = argumentParser
		this.logger = logger
		this.rulesetParser = rulesetParser
		this.rulesetValidator = rulesetValidator
	}

	/**
	 * Create directory for screenshots if it does not exist,
	 * then instantiate browser.
	 */
	public async init (args: LensArguments, config: LensConfig): Promise<void> {
		this.args = this.argumentParser.parse(args)
		this.config = config

		this.overrideConfigFromFlags()
		this.createOutputDirectory()

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
	private async runFromRuleset (): Promise<void> {
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
	private async runFromArgs (): Promise<void> {
		await forEachAsync(this.args.urls, async url => {
			this.logger.header(`Running lens for ${url.href}`)

			const directory = this.createDirectoryForUrl(url, this.args.tag)
			await this.generateScreenshots(url, directory, this.args.resolutions)
		})
	}

	/**
	 * Create directory where screenshots of the specified url will be stored
	 *
	 * @param url
	 * @param tag
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
					ExitCode.DirectoryNotCreated
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
					ExitCode.DirectoryNotCreated
				)
			}
		}
	}

	/**
	 * Generate screenshots based on the specified arguments
	 *
	 * @param url
	 * @param dir
	 * @param viewportSet
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
	 * @param dir
	 * @param tag
	 * @param url
	 * @param viewport
	 * @private
	 */
	private async generateScreenshot (
		dir: string,
		tag: string,
		url: URL,
		viewport: Viewport
	): Promise<void> {
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
