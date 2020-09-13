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

export {
	LensArguments, ParsedLensArguments, Resolution,
	Logger
}
