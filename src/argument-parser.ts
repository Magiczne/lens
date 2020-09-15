import path from 'path'
import { Viewport } from 'puppeteer'
import nodeUrl, { UrlWithStringQuery } from 'url'

import { ArgumentParser, LensArguments, ParsedLensArguments } from '@/typings/types'
import { defaultViewports } from '@/viewports'
import { LensResolutionError } from '@/errors'

export default class DefaultArgumentParser implements ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments {
        return {
            urls: this.parseUrls(args.url),
            resolutions: this.parseResolution(args.resolution),
            tag: args.tag,

            outputDir: this.parseDirectory(args.outputDir)
        }
    }

    /**
     * Resolve path to directory if present.
     * Return undefined otherwise.
     *
     * @param dir
     * @private
     */
    private parseDirectory (dir?: string): string | undefined {
        if (dir) {
            return path.resolve(dir)
        }

        return undefined
    }

    /**
     * Retrieve all resolutions from the input argument.
     * If argument is not present, use default resolutions list.
     *
     * @param resolution
     * @private
     */
    private parseResolution (resolution?: string): Record<string, Viewport[]> {
        if (!resolution) {
            return defaultViewports
        }

        const viewports = resolution.split(' ')
            .map(res => {
                const parsedResolution = res.trim()
                    .split('x')
                    .map(x => parseInt(x, 10))

                if (parsedResolution.length !== 2) {
                    throw new LensResolutionError(`Invalid resolution ${res}. It should follow format [width]x[height]`)
                }

                return parsedResolution
            })
            .map(res => {
                return {
                    width: res[0],
                    height: res[1]
                }
            })

        return { default: viewports }
    }

    /**
     * Retrieve all urls from the input arguments
     *
     * @param url
     * @private
     */
    private parseUrls (url: string): UrlWithStringQuery[] {
        return url.split(' ')
            .map(u => nodeUrl.parse(u))
    }
}
