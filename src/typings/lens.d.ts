import type { PuppeteerLifeCycleEvent, Viewport } from 'puppeteer'

import type { RulesetParser, RulesetValidator } from '@/typings/rules'
import type { Logger } from '@/typings/logging'
import type { ViewportType } from '@/viewports'

interface ArgumentParser {
    /**
     * Parse input CLI arguments and return parsed arguments
     * that can be safely used in the application.
     *
     * @param args Input arguments got from CLI
     * @return Parsed, safe arguments
     */
    parse (args: LensArguments): ParsedLensArguments

    /**
     * Parse directory string and return fully qualified path to the directory.
     *
     * If the directory was not passed function should return undefined.
     *
     * @param dir Path to the directory
     * @return Fully qualified path to the directory
     */
    parseDirectory (dir?: string): string | undefined

    /**
     * Retrieve all resolutions by existing key
     *
     * If the resolution argument is not present list of default viewports
     * filtered by te viewport name will be returned.
     * In other case, default viewports are ignored and only parsed resolutions
     * will be returned.
     *
     * @param viewports List of default viewports types to be included
     * @param resolution (Optional) List of resolutions to be parsed
     */
    parseViewports (viewports: ReadonlyArray<ViewportType>, resolution?: string[]): Record<string, Viewport[]>

    /**
     * Parse list of strings that represents URLs
     *
     * @param url List of strings
     * @return List of parsed URL objects
     */
    parseUrl (url?: string[]): URL[]
}

interface LensArguments {
    [x: string]: unknown

    'url'?: Array<string>
    'resolution'?: Array<string>
    'viewports': ReadonlyArray<ViewportType>
    'tag': string

    'input-dir'?: string
    'output-dir'?: string

    '_': Array<string | number>
    '$0': string
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
        waitUntil: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[]
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
