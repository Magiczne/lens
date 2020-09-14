import { UrlWithStringQuery } from 'url'
import { Viewport } from 'puppeteer'

type Resolution = Pick<Viewport, 'width' | 'height' | 'deviceScaleFactor'>

interface LensArguments {
	[x: string]: unknown

	url: string
	resolution?: string
	tag: string

	_: string[]
	$0: string
}

interface LensDependencies {
	argumentParser: ArgumentParser
	logger: Logger
}

interface ParsedLensArguments {
	urls: UrlWithStringQuery[]
	resolutions: Record<string, Resolution[]>
	tag: string
}

interface Logger {
	error (message: string): void
	header (message: string): void
	info (message: string): void
	success (message: string): void
}

interface ArgumentParser {
	parse (args: LensArguments): ParsedLensArguments
}

export {
	ArgumentParser,
	LensArguments, LensDependencies, ParsedLensArguments, Resolution,
	Logger
}
