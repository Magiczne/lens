/* eslint-disable @typescript-eslint/no-explicit-any */

import { UrlWithStringQuery } from 'url'

const url = jest.createMockFromModule('url') as any

url.parse = (urlStr: string): UrlWithStringQuery => {
    return {
        auth: null,
        hash: null,
        host: null,
        hostname: null,
        href: urlStr,
            path: null,
            pathname: null,
            protocol: null,
            search: null,
            slashes: null,
            port: null,
            query: null
    }
}

export default url
