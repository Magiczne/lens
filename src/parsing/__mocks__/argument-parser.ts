/* eslint-disable @typescript-eslint/no-unused-vars */

import path from 'path'
import { Viewport } from 'puppeteer'

import { ArgumentParser, LensArguments, ParsedLensArguments } from '@/typings/lens'
import { ViewportType } from '@/viewports'

export default class ArgumentParserMock implements ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments {
        return {
            urls: [],
            inputDir: path.resolve(args['input-dir'] ?? './rules'),
            outputDir: path.resolve(args['output-dir'] ?? './screenshots'),
            tag: args.tag,
            viewportSet: {
                default: [{ width: 1920, height: 1080 }]
            }
        }
    }

    parseDirectory (dir?: string): string | undefined {
        return dir
    }

    parseUrl (url?: string[]): URL[] {
        return []
    }

    parseViewports (viewports: ReadonlyArray<ViewportType>, resolution?: string[]): Record<string, Viewport[]> {
        return {
            default: [{ width: 1920, height: 1080 }]
        }
    }
}
