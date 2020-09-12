#!/usr/bin/env node

import yargs from 'yargs'

import { LensArguments } from './typings/types'
import Lens from './lens'

const args: LensArguments = yargs
	.usage('Usage: -u <url> -r <resolution>')
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
	.demandOption(['url', 'resolution'], 'Please provide both url and resolution arguments to work with this tool')
	.epilogue('For advanced usage documentation please visit https://github.com/Magiczne/lens')
	.example('lens -u https://example.com -r 1280x720', '')
	.example('lens -u "https://example.com https://example.com/subpage" -r 1920x1080', '')
	.example('lens -u https://example.com -r "800x600 1280x720"', '')
	.example('lens -u https://example.com -r 1280x720 -t "custom tag"', '')
	.argv

const main = async () => {
	const lens = new Lens(args)
	await lens.init()
	await lens.run()
	await lens.dispose()
}

main()
