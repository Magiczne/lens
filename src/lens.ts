import fs from 'fs'
import puppeteer, { Browser, Viewport } from 'puppeteer'

import ExitCode from '@/enums/exit-code'
import {
	ArgumentParser, LensArguments, LensConfig, LensDependencies, Logger, ParsedLensArguments
} from '@/typings/types'
import { forEachAsync } from '@/utils'

export default class Lens {
	private readonly argumentParser: ArgumentParser
	private browser: Browser | undefined
	private readonly logger: Logger

	private args: ParsedLensArguments
	private config: LensConfig

	public constructor ({ argumentParser, logger }: LensDependencies) {
		this.argumentParser = argumentParser
		this.logger = logger
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
			this.logger.error('Lens has not been initialized. Please run "init" before running.')

			process.exit(ExitCode.BrowserNotInitialized)
		}

		await forEachAsync(this.args.urls, async url => {
			this.logger.header(`Running lens for ${url.href}`)

			const directory = this.createDirectoryForUrl(url, this.args.tag)
			await this.generateScreenshots(url, directory)
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
				this.logger.error(`Could not create directory ${directory}`)

				process.exit(ExitCode.DirectoryNotCreated)
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
				this.logger.error(`Could not create screenshots directory`)

				process.exit(ExitCode.DirectoryNotCreated)
			}
		}
	}

	/**
	 * Generate screenshots based on the specified arguments
	 *
	 * @param url
	 * @param dir
	 * @private
	 */
	private async generateScreenshots (url: URL, dir: string): Promise<void> {
		let pendingScreenshots: Promise<void>[] = []

		// TODO: Running all data at once may cause some issues. Make it run some batch of screenshots at a time
		for (const [key, value] of Object.entries(this.args.resolutions)) {
			pendingScreenshots = pendingScreenshots.concat(value.map(async viewport => {
				if (!this.browser) return // TODO: Handle that in a prettier way

				// Do not remove space at the end of tag.
				const tag = key === 'default' ? '' : `[${key}] `
				await this.generateScreenshot(dir, tag, url, viewport)
			}))
		}

		await Promise.all(pendingScreenshots)
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
	}

	/**
	 * Do the cleanup
	 */
	public async dispose (): Promise<void> {
		await this.browser?.close()
	}
}
