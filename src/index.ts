#!/usr/bin/env node

import yargs from 'yargs'

import config from '@/config'
import { LensArguments } from '@/typings/types'
import Lens from '@/lens'
import DefaultArgumentParser from '@/argument-parser'
import ConsoleLogger from '@/logging/console-logger'
import { LensCriticalError } from '@/errors'

const args: LensArguments = yargs
	.usage('Usage: lens -u <url>')
	.option('url', {
		alias: 'u',
		describe: 'The url from which screenshots will be taken. ' +
                  'If you want to create screenshots from multiple urls separate them with a space.' +
                  '(e.g. https://example.com https://example.com/subpage)',
		string: true
	})
	.option('resolution', {
		alias: 'r',
		describe: 'Custom resolution (e.g. 800x600). ' +
			'If you want to create screenshots for multiple resolutions separate them with a space ' +
            '(e.g. 800x600 1920x1080)',
		string: true
	})
	.option('tag', {
		alias: 't',
		describe: 'Custom tag that will be used as a subdirectory for screenshots',
		string: true,
		default: ''
	})
	.option('output-dir', {
		alias: 'o',
		describe: 'Output directory for the screenshots',
		string: true
	})
	.demandOption(['url'], 'You need to provide at least the "url" parameter to work with this tool')
	.epilogue('For advanced usage documentation please visit https://github.com/Magiczne/lens')
	.example('lens -u https://example.com', '')
	.example('lens -u https://example.com -r 1280x720', '')
	.example('lens -u "https://example.com https://example.com/subpage" -r 1920x1080', '')
	.example('lens -u https://example.com -r "800x600 1280x720" -o ./output', '')
	.example('lens -u https://example.com -r 1280x720 -t "custom tag"', '')
	.argv

const main = async () => {
	const lensConfig = await config()
	const logger = new ConsoleLogger()
	const lens = new Lens({
		argumentParser: new DefaultArgumentParser(),
		logger
	})

	try {
		await lens.init(args, lensConfig)
		await lens.run()
		await lens.dispose()
	} catch (e) {
		if (e.name === 'LensCriticalError') {
			process.exitCode = (e as LensCriticalError).code

			await lens?.dispose()

			throw e
		} else if (e.name.startsWith('Lens')) {
			logger.error(e.message)
		} else {
			await lens?.dispose()

			throw e
		}
	}
}

main()
