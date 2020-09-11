import fs from 'fs'
import puppeteer, { Browser } from 'puppeteer'
import url, { UrlWithStringQuery } from 'url'

import { LensArguments, Logger, ParsedLensArguments } from './typings/types'
import { ConsoleLogger } from './logger'

export default class Lens {
	private readonly screenshotsDir = './screenshots'

	private browser: Browser
	private logger: Logger

	public constructor (logger: Logger = undefined) {
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
	 * Run lens with specified arguments
	 *
	 * @param args
	 */
	public async run (args: LensArguments): Promise<void> {
		const parsedArgs = this.parseArguments(args)
		this.logger.header(`Running lens for ${args.url}`)

		const directory = this.createDirectoryForUrl(parsedArgs.url, parsedArgs.tag)
		await this.generateScreenshot(parsedArgs, directory)
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
		const page = await this.browser.newPage()

		await page.setViewport({ ...args.resolution })
		await page.goto(args.url.href)
		await page.screenshot({
			path: `${dir}/${args.resolution.width}x${args.resolution.height}.png`
		})

		this.logger.success(`[DONE] ${args.url.host} ${args.resolution.width}x${args.resolution.height}`)

		await page.close()
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
		const resolution = args.resolution
			? args.resolution.split('x').map(x => parseInt(x, 10))
			: undefined

		return {
			url: url.parse(args.url),
			resolution: args.resolution ? {
				width: resolution[0],
				height: resolution[1]
			} : undefined,
			tag: args.tag,
		}
	}
}
