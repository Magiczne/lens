import fs from 'fs'
import puppeteer, { Browser } from 'puppeteer'
import { UrlWithStringQuery } from 'url'

import {
	ArgumentParser, LensArguments, LensConfig, LensDependencies, Logger, ParsedLensArguments
} from '@/typings/types'
import { forEachAsync } from '@/utils'

export default class Lens {
	private readonly screenshotsDir = './screenshots'

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

		if (!fs.existsSync(this.screenshotsDir)) {
			try {
				fs.mkdirSync(this.screenshotsDir, { recursive: true })
				this.logger.info(`Created ${this.screenshotsDir}`)
			} catch (e) {
				this.logger.error(`Could not create screenshots directory`)

				process.exit(14)
			}
		}

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

			process.exit(15)
		}

		await forEachAsync(this.args.urls, async u => {
			this.logger.header(`Running lens for ${u.href}`)

			const directory = this.createDirectoryForUrl(u, this.args.tag)
			await this.generateScreenshots(this.args, u, directory)
		})
	}

	/**
	 * Create directory where screenshots of the specified url will be stored
	 *
	 * @param url
	 * @param tag
	 * @private
	 */
	private createDirectoryForUrl (url: UrlWithStringQuery, tag = ''): string {
		let directory = `${this.screenshotsDir}/${url.host}`
		if (tag) {
			directory = `${directory}/${tag}`
		}

		if (!fs.existsSync(directory)) {
			try {
				fs.mkdirSync(directory, { recursive: true })
				this.logger.info(`Created ${directory}`)
			} catch {
				this.logger.error(`Could not create directory ${directory}`)

				process.exit(14)
			}
		}

		return directory
	}

	/**
	 * Generate screenshots based on the specified arguments
	 *
	 * @param args
	 * @param url
	 * @param dir
	 * @private
	 */
	private async generateScreenshots (args: ParsedLensArguments, url: UrlWithStringQuery, dir: string): Promise<void> {
		let pendingScreenshots: Promise<void>[] = []

		for (const key of Object.keys(args.resolutions)) {
			// TODO: Extract screenshot taking to separate method
			pendingScreenshots = pendingScreenshots.concat(args.resolutions[key].map(async res => {
				if (!this.browser) return // TODO: Handle that in a prettier way

				const page = await this.browser.newPage()

				await page.setViewport({ ...res })
				await page.goto(url.href, {
					waitUntil: this.config.puppeteer.waitUntil
				})
				await page.screenshot({
					path: `${dir}/${key !== 'default' ? `[${key}] ` : ''}${res.width}x${res.height}.png`
				})

				await page.close()

				this.logger.success(`${url.host} ${res.width}x${res.height}`)
			}))
		}

		await Promise.all(pendingScreenshots)
	}

	/**
	 * Do the cleanup
	 */
	public async dispose (): Promise<void> {
		await this.browser?.close()
	}
}
