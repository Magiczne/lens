import { cosmiconfig } from 'cosmiconfig'
import deepmerge from 'deepmerge'
import isInstalledGlobally from 'is-installed-globally'
import os from 'os'
import packageDir from 'pkg-dir'

import { LensConfig } from '@/typings/types'

const defaultConfig: LensConfig = {
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
        stopDir: searchDirectory
    })

    const { config } = (await explorer.search(searchDirectory)) || { config: {} }

    return deepmerge(defaultConfig, config)
}

export default config
