import { LoadEvent, Viewport } from 'puppeteer'

interface LensArguments {
	[x: string]: unknown

	url: string
	resolution?: string
	tag: string

	outputDir?: string

	_: string[]
	$0: string
}

interface LensConfig {
	chunkSize: number,
	directories: {
		output: string
	},
	puppeteer: {
		headless: boolean,
		waitUntil: LoadEvent | LoadEvent[]
	}
}

interface LensDependencies {
	argumentParser: ArgumentParser
	logger: Logger
}

interface ParsedLensArguments {
	urls: URL[]
	resolutions: Record<string, Viewport[]>
	tag: string

	outputDir?: string
}

interface Logger {
	error (message: string): void
	header (message: string): void
	info (message: string): void
	success (message: string): void
}

interface ArgumentParser {
	parse (args: LensArguments): ParsedLensArguments

	parseDirectory (dir?: string): string | undefined
	parseResolution (resolution?: string): Record<string, Viewport[]>
	parseUrl (url: string): URL[]
}

export {
	ArgumentParser,
	LensArguments, LensConfig, LensDependencies, ParsedLensArguments,
	Logger
}
