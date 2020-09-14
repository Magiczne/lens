import nodeUrl, { UrlWithStringQuery } from 'url'

import { ArgumentParser, LensArguments, ParsedLensArguments, Resolution } from '@/typings/types'
import { defaultResolutions } from '@/resolutions'

export default class DefaultArgumentParser implements ArgumentParser {
    parse (args: LensArguments): ParsedLensArguments {
        return {
            urls: this.parseUrls(args.url),
            resolutions: this.parseResolution(args.resolution),
            tag: args.tag
        }
    }

    /**
     * Retrieve all resolutions from the input argument.
     * If argument is not present, use default resolutions list.
     *
     * @param resolution
     * @private
     */
    private parseResolution (resolution?: string): Record<string, Resolution[]> {
        if (!resolution) {
            return defaultResolutions
        }

        const resolutions =  resolution.split(' ')
            .map(res => {
                return res.trim()
                    .split('x')
                    .map(x => parseInt(x, 10))
            })
            .map(res => {
                return {
                    width: res[0],
                    height: res[1]
                }
            })

        return { default: resolutions }
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
