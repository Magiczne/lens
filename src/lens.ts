import fs from 'fs'
import puppeteer, { Browser } from 'puppeteer'
import url, { UrlWithStringQuery } from 'url'

import { LensArguments, Logger, ParsedLensArguments, Resolution } from '@/typings/types'
import { ConsoleLogger } from '@/logger'
import { forEachAsync } from '@/utils'
import { defaultResolutions } from '@/resolutions'

export default class Lens {
	private readonly screenshotsDir = './screenshots'

	private readonly args: ParsedLensArguments
	private browser: Browser | undefined
	private logger: Logger

	public constructor (args: LensArguments, logger: Logger | undefined = undefined) {
		this.args = this.parseArguments(args)
		this.logger = logger ?? new ConsoleLogger()
	}

	/**
	 * Create directory for screenshots if it does not exist,
	 * then instantiate browser.
	 */
	public async init (): Promise<void> {
		if (!fs.existsSync(this.screenshotsDir)) {
			try {
				fs.mkdirSync(this.screenshotsDir, { recursive: true })
				this.logger.info(`Created ${this.screenshotsDir}`)
			} catch (e) {
				this.logger.error(`Could not create screenshots directory`)

				process.exit(14)
			}
		}

		this.browser = await puppeteer.launch()
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
				await page.goto(url.href)
				await page.screenshot({
					path: `${dir}/${key !== 'default' ? `[${key}] ` : ''}${res.width}x${res.height}.png`
				})

				await page.close()

				this.logger.success(`[DONE] ${url.host} ${res.width}x${res.height}`)
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
