import { cosmiconfig } from 'cosmiconfig'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'
import isInstalledGlobally from 'is-installed-globally'
import { defaultsDeep } from 'lodash'
import os from 'os'
import packageDir from 'pkg-dir'
import path from 'path'

import { LensConfig } from '@/typings/types'

const defaultConfig: LensConfig = {
    chunkSize: 5,
    directories: {
        output: path.resolve('./screenshots')
    },
    puppeteer: {
        headless: true,
        waitUntil: [
            'load', 'networkidle2'
        ]
    }
}

const config = async (): Promise<LensConfig>  => {
    const searchDirectory = isInstalledGlobally
        ? os.homedir()
        : await packageDir()

    const searchPlaces = [
        '.lens.config.json',
        '.lens.config.js'
    ]

    const explorer = cosmiconfig('lens', {
        searchPlaces: searchPlaces,
        stopDir: searchDirectory,
        transform (result: CosmiconfigResult): CosmiconfigResult {
            // Resolve output filepath
            if (result.config.directories && result.config.directories.output) {
                result.config.directories.output = path.resolve(result.config.directories.output)
            }

            return result
        }
    })

    const { config } = (await explorer.search(searchDirectory)) || { config: {} }

    return defaultsDeep(config, defaultConfig)
}

export default config
