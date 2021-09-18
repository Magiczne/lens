import path from 'path'
import type { Viewport } from 'puppeteer'

import { LensResolutionError, LensUrlError } from '@/errors'
import type { ArgumentParser, LensArguments, ParsedLensArguments } from '@/typings/types'
import { filterObject } from '@/util'
import { defaultViewports, ViewportType } from '@/viewports'

export default class DefaultArgumentParser implements ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments {
        return {
            urls: this.parseUrl(args.url),
            viewportSet: this.parseViewports(args.viewports, args.resolution),
            tag: args.tag,

            inputDir: this.parseDirectory(args['input-dir']),
            outputDir: this.parseDirectory(args['output-dir'])
        }
    }

    /**
     * Resolve path to directory if present.
     * Return undefined otherwise.
     *
     * @param dir
     */
    parseDirectory (dir?: string): string | undefined {
        if (dir) {
            return path.resolve(dir)
        }

        return undefined
    }

    /**
     * Retrieve all resolutions from the input argument.
     * If argument is not present, use default resolutions list.
     *
     * If resolutions array is not present filter default viewports by the keys passed in the viewports array.
     *
     * @param viewports
     * @param resolution
     */
    parseViewports (viewports: ReadonlyArray<ViewportType>, resolution?: string[]): Record<string, Viewport[]> {
        if (!resolution || !resolution.length) {
            return filterObject(defaultViewports, viewports)
        }

        const computedViewports = resolution.map(res => {
            const parsedResolution = res.trim()
                .split('x')
                .map(x => parseInt(x, 10))

            if (parsedResolution[0] <= 0 || parsedResolution[1] <= 0) {
                throw new LensResolutionError(`Invalid resolution ${res}. Resolution cannot be smaller than 0`)
            }

            if (parsedResolution.length !== 2) {
                throw new LensResolutionError(`Invalid resolution ${res}. It should follow format [width]x[height]`)
            }

            return parsedResolution
        }).map(res => {
            return {
                width: res[0],
                height: res[1]
            }
        })

        return { default: computedViewports }
    }

    /**
     * Retrieve all urls from the input arguments
     *
     * @param url
     */
    parseUrl (url?: string[]): URL[] {
        if (!url) {
            return []
        }

        return url.map(u => {
            let url: URL

            try {
                url = new URL(u)
            } catch (e) {
                throw new LensUrlError(`Url ${u} is invalid. Remember to include protocol!`)
            }

            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new LensUrlError(`Url ${u} is invalid. Only http: and https: protocols are allowed`)
            }

            return url
        })
    }
}
