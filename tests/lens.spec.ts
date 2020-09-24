import path from 'path'

import { LensCriticalError } from '@/errors'
import Lens from '@/lens'
import ConsoleLogger from '@/logging/console-logger'
import DefaultArgumentParser from '@/parsing/argument-parser'
import DefaultRulesetParser from '@/parsing/ruleset-parser'
import { LensArguments, LensConfig } from '@/typings/lens'
import DefaultRulesetValidator from '@/validation/ruleset-validator'

jest.mock('@/logging/console-logger')
jest.mock('@/parsing/argument-parser')
jest.mock('@/parsing/ruleset-parser')
jest.mock('@/validation/ruleset-validator')

describe('Lens', () => {
    const defaultArgs: LensArguments = {
        _: [],
        $0: '',

        url: ['https://example.com'],
        resolution: ['1280x720'],
        viewports: ['desktop', 'tablet', 'phone'],
        tag: 'default'
    }

    const defaultConfig: LensConfig = {
        chunkSize: 5,
        directories: {
            input: path.resolve('./rules'),
            output: path.resolve('./screenshots')
        },
        puppeteer: {
            headless: true,
            waitUntil: [
                'load', 'networkidle2'
            ]
        }
    }

    const lensFactory = (args?: Partial<LensArguments>, config?: Partial<LensConfig>): Lens => {
        return new Lens({
            argumentParser: new DefaultArgumentParser(),
            logger: new ConsoleLogger(),
            rulesetParser: new DefaultRulesetParser(),
            rulesetValidator: new DefaultRulesetValidator()
        }, {
            ...defaultArgs,
            ...args
        }, {
            ...defaultConfig,
            ...config
        })
    }

    it('should throw critical error when run without initialization', () => {
        const lens = lensFactory()

        expect(lens.run())
            .rejects
            .toThrow(LensCriticalError)
    })

    it('should throw critical error when input directory does not exist', async () => {
        const lens = lensFactory({
            inputDir: './not-existing-directory'
        })

        await lens.init()

        await expect(lens.run())
            .rejects
            .toThrow(LensCriticalError)

        await lens.dispose()
    })
})
