import { UrlWithStringQuery } from 'url'

interface LensArguments {
	[x: string]: unknown

	url: string
	resolution?: string
	tag: string

	_: string[]
	$0: string
}

interface ParsedLensArguments {
	url: UrlWithStringQuery
	resolution?: {
		width: number
		height: number
	}
	tag: string
}

interface Logger {
	error (message: string): void
	header (message: string): void
	info (message: string): void
	success (message: string): void
}

export {
	LensArguments, ParsedLensArguments,
	Logger
}
