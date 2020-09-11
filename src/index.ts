import yargs from 'yargs'

import { Device, LensArguments } from './typings/types'
import Lens from './lens'

const args: LensArguments = yargs
	.usage('Usage: -u <url>')
	.option('url', {
		alias: 'u',
		describe: 'The url from which screenshots will be taken. ' +
                  'If you want to create screenshots from multiple urls separate them with a space.' +
                  '(e.g. https://example.com https://example.com/subpage)',
		string: true,
		demandOption: true
	})
	.option('resolution', {
		alias: 'r',
		string: true,
		describe: 'Custom resolution (e.g. 800x600). ' +
			'If you want to create screenshots for multiple resolutions separate them with a space ' +
            '(e.g. 800x600 1920x1080)'
	})
	.option('tag', {
		alias: 't',
		describe: 'Custom tag that will be applied to filenames',
		string: true,
		default: ''
	})
	.argv

const main = async () => {
	const lens = new Lens(args)
	await lens.init()
	await lens.run()
	await lens.dispose()
}

main()
