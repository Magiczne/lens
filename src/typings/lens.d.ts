import { LoadEvent, Viewport } from 'puppeteer'
import { Logger } from '@/typings/logging'
import { RulesetValidator } from '@/typings/rules'

interface ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments

    parseDirectory (dir?: string): string | undefined
    parseResolution (resolution?: string): Record<string, Viewport[]>
    parseUrl (url: string): URL[]
}

interface LensArguments {
    [x: string]: unknown

    url?: string
    resolution?: string
    tag: string

    outputDir?: string

    _: string[]
    $0: string
}

interface ParsedLensArguments {
    urls: URL[]
    resolutions: Record<string, Viewport[]>
    tag: string

    outputDir?: string
}

interface LensConfig {
    chunkSize: number
    directories: {
        output: string
    }
    puppeteer: {
        headless: boolean
        waitUntil: LoadEvent | LoadEvent[]
    }
}

interface LensDependencies {
    argumentParser: ArgumentParser
    logger: Logger
    rulesetValidator: RulesetValidator
}

export {
    ArgumentParser,
    LensArguments, ParsedLensArguments,
    LensConfig, LensDependencies
}