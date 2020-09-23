#!/usr/bin/env node

import yargs from 'yargs'

import config from '@/config'
import Lens from '@/lens'
import { LensCriticalError, LensRulesetError } from '@/errors'
import ConsoleLogger from '@/logging/console-logger'
import { LogLevel } from '@/logging/log-level'
import DefaultArgumentParser from '@/parsing/argument-parser'
import { DefaultRulesetParser } from '@/parsing/ruleset-parser'
import { LensArguments } from '@/typings/types'
import { DefaultRulesetValidator } from '@/validation/ruleset-validator'
import { availableViewportSets } from '@/viewports'

const args: LensArguments = yargs
	.option('url', {
		alias: 'u',
		describe: 'The url from which screenshots will be taken. ' +
                  'If you want to create screenshots from multiple urls separate them with a space ' +
                  '(e.g. https://example.com https://example.com/page). ' +
                  'Remember to include protocol (http:// or https://)',
		string: true,
		array: true
	})
	.option('resolution', {
		alias: 'r',
		describe: 'Custom resolution (e.g. 800x600). ' +
			'If you want to create screenshots for multiple resolutions separate them with a space ' +
            '(e.g. 800x600 1920x1080)',
		string: true,
		array: true
	})
	.option('viewports', {
		alias: 'v',
		choices: availableViewportSets,
		default: availableViewportSets,
		describe: 'Render screenshots only for selected viewport types',
		string: true,
		array: true
	})
	.option('tag', {
		alias: 't',
		describe: 'Custom tag that will be used as a subdirectory for screenshots',
		string: true,
		default: ''
	})
	.option('input-dir', {
		alias: 'i',
		describe: 'Input directory with screenshot rules',
		string: true
	})
	.option('output-dir', {
		alias: 'o',
		describe: 'Output directory for the screenshots',
		string: true
	})
	.conflicts('url', 'input-dir')
	.conflicts('resolution', 'input-dir')
	.conflicts('viewports', 'resolution')
	.epilogue('For advanced usage documentation please visit https://github.com/Magiczne/lens')
	.example('lens -u https://example.com', '')
	.example('lens -u https://example.com -r 1280x720', '')
	.example('lens -u https://example.com https://example.com/subpage -r 1920x1080', '')
	.example('lens -u https://example.com -r 800x600 1280x720 -o ./output', '')
	.example('lens -u https://example.com -r 1280x720 -t "custom tag"', '')
	.example('lens -u https://example.com -v desktop phone', '')
	.showHelpOnFail(false, 'Use lens --help for available options')
	.wrap(Math.min(120, yargs.terminalWidth()))
	.argv

const main = async () => {
	const lensConfig = await config()
	const logger = new ConsoleLogger()
	const lens = new Lens({
		argumentParser: new DefaultArgumentParser(),
		logger,
		rulesetParser: new DefaultRulesetParser(),
		rulesetValidator: new DefaultRulesetValidator()
	}, args, lensConfig)

	try {
		await lens.init()
		await lens.run()
		await lens.dispose()
	} catch (e) {
		if (e.name === 'LensCriticalError') {
			process.exitCode = (e as LensCriticalError).code

			await lens?.dispose()

			logger.header(e.message, LogLevel.Critical)

			throw e
		} else if (e.name === 'LensRulesetError') {
			const error = e as LensRulesetError

			logger.header(error.message, LogLevel.Error)
			error.validationError.errors.forEach(err => {
				logger.error(err)
			})

			await lens?.dispose()
		} else if (e.name.startsWith('Lens')) {
			logger.error(e.message)
		} else {
			await lens?.dispose()

			throw e
		}
	}
}

main()
