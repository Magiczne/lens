import each from 'jest-each'

import { ArgumentParser, LensArguments } from '@/typings/types'
import DefaultArgumentParser from '@/argument-parser'
import { defaultViewports } from '@/viewports'
import { LensResolutionError } from '@/errors'

jest.mock('url')
import url from 'url'

describe('DefaultArgumentParser', () => {
    let parser: ArgumentParser

    const createLensArguments = (args: Partial<LensArguments> = {}): LensArguments => {
        return {
            _: [],
            $0: '',

            url: 'https://example.com',
            resolution: '1280x720',
            tag: 'default',

            ...args
        }
    }

    beforeEach(() => {
        parser = new DefaultArgumentParser()
    })

    it('parses multiple arguments', () => {
        const args = createLensArguments({
            url: 'https://example.com https://example.com/subpage',
            resolution: '1280x720 1920x1080',
            tag: 'custom tag',
        })

        const parsedArgs = parser.parse(args)

        expect(parsedArgs).toStrictEqual({
            urls: [
                url.parse('https://example.com'),
                url.parse('https://example.com/subpage')
            ],
            resolutions: {
                default: [
                    { width: 1280, height: 720 },
                    { width: 1920, height: 1080 }
                ]
            },
            tag: 'custom tag'
        })
    })

    it('parses single arguments', () => {
        const args = createLensArguments()
        const parsedArgs = parser.parse(args)

        expect(parsedArgs).toStrictEqual({
            urls: [
                url.parse('https://example.com')
            ],
            resolutions: {
                default: [
                    { width: 1280, height: 720 }
                ]
            },
            tag: 'default'
        })
    })

    it('assigns default resolutions', () => {
        const args = createLensArguments({
            resolution: undefined
        })
        const parsedArgs = parser.parse(args)

        expect(parsedArgs).toStrictEqual({
            urls: [
                url.parse('https://example.com')
            ],
            resolutions: defaultViewports,
            tag: 'default'
        })
    })

    each([
        '1280', '1280xx720', '1280;720',
        '1280x720 1920 1080', '1280x720 1650;1080'
    ]).it('should throw on invalid resolution (%s)', (res) => {
        const args = createLensArguments({
            resolution: res
        })

        expect(() => {
            parser.parse(args)
        }).toThrow(LensResolutionError)
    })
})
