import fs from 'fs'
import puppeteer, { Browser } from 'puppeteer'
import url, { UrlWithStringQuery } from 'url'

import { LensArguments, Logger, ParsedLensArguments, Resolution } from './typings/types'
import { ConsoleLogger } from './logger'

export default class Lens {
	private readonly screenshotsDir = './screenshots'

	private readonly args: ParsedLensArguments
	private browser: Browser
	private logger: Logger

	public constructor (args: LensArguments, logger: Logger = undefined) {
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
		this.logger.header(`Running lens for ${this.args.url.href}`)

		const directory = this.createDirectoryForUrl(this.args.url, this.args.tag)
		await this.generateScreenshot(this.args, directory)
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
	 * Generate screenshot based on the specified arguments
	 *
	 * @param args
	 * @param dir
	 * @private
	 */
	private async generateScreenshot (args: ParsedLensArguments, dir: string): Promise<void> {
		await Promise.all(args.resolutions.map(async res => {
			const page = await this.browser.newPage()

			await page.setViewport({ ...res })
			await page.goto(args.url.href)
			await page.screenshot({
				path: `${dir}/${res.width}x${res.height}.png`
			})

			await page.close()

			this.logger.success(`[DONE] ${args.url.host} ${res.width}x${res.height}`)
		}))
	}

	/**
	 * Do the cleanup
	 */
	public async dispose (): Promise<void> {
		await this.browser.close()
	}

	/**
	 * Parse arguments from user and return them
	 *
	 * @param args
	 * @private
	 */
	private parseArguments (args: LensArguments): ParsedLensArguments {
		const resolutions: Resolution[] | undefined = args.resolution
			? args.resolution.split(' ')
				.map(res => {
					return res.trim()
						.split('x')
						.map(x => parseInt(x, 10))
				})
				.map(res => {
					return {
						width: res[0],
						height: res[1]
					} as Resolution
				})
			: undefined

		return {
			url: url.parse(args.url),
			resolutions: resolutions,
			tag: args.tag,
		}
	}
}
