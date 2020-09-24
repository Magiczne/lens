import { LoadEvent, Viewport } from 'puppeteer'

import { RulesetParser, RulesetValidator } from '@/typings/rules'
import { Logger } from '@/typings/logging'
import { ViewportType } from '@/viewports'

interface ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments

    parseDirectory (dir?: string): string | undefined
    parseViewports (viewports: ReadonlyArray<ViewportType>, resolution?: string[]): Record<string, Viewport[]>
    parseUrl (url?: string[]): URL[]
}

interface LensArguments {
    [x: string]: unknown

    url?: string[]
    resolution?: string[]
    viewports: ReadonlyArray<ViewportType>
    tag: string

    inputDir?: string
    outputDir?: string

    _: string[]
    $0: string
}

interface ParsedLensArguments {
    urls: URL[]
    viewportSet: Record<string, Viewport[]>
    tag: string

    inputDir?: string
    outputDir?: string
}

interface LensConfig {
    chunkSize: number
    directories: {
        input: string
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
    rulesetParser: RulesetParser
    rulesetValidator: RulesetValidator
}

export {
    ArgumentParser,
    LensArguments, ParsedLensArguments,
    LensConfig, LensDependencies
}
