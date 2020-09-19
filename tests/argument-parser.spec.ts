import each from 'jest-each'

import { ArgumentParser, LensArguments } from '@/typings/types'
import DefaultArgumentParser from '@/argument-parser'
import { defaultViewports } from '@/viewports'
import { LensResolutionError, LensUrlError } from '@/errors'

jest.mock('path')

describe('DefaultArgumentParser', () => {
    let parser: ArgumentParser

    beforeEach(() => {
        parser = new DefaultArgumentParser()
    })

    describe('parseDirectory', () => {
        it('returns undefined when directory is undefined', () => {
            const directory = parser.parseDirectory(undefined)

            expect(directory).toBe(undefined)
        })

        it('returns resolved path', () => {
            const directory = parser.parseDirectory('./screenshots')

            expect(directory).toBe('resolved path')
        })
    })

    describe('parseResolution', () => {
        it('return default viewports with no arguments', () => {
            const viewports = parser.parseResolution()

            expect(viewports).toStrictEqual(defaultViewports)
        })

        each([
            // Invalid number of parts
            '1280', '1280x720x2', '1280x720 720',
            // Invalid separator
            '1280xx720', '1280;720', '1280x720 1280.720',
            // Negative resolution
            '-1280x720', '-1280x-720',
            // Zero
            '0x720', '0x0'
        ]).it('should throw on invalid resolution (%s)', (res) => {
            expect(() => {
                parser.parseResolution(res)
            }).toThrow(LensResolutionError)
        })

        it('parses resolution correctly', () => {
            const viewports = parser.parseResolution('1280x720')

            expect(viewports).toStrictEqual({
                default: [
                    {
                        width: 1280,
                        height: 720
                    }
                ]
            })
        })
    })

    describe('parseUrl', () => {
        it('should throw on invalid url', () => {
            expect(() => {
                parser.parseUrl('example.com')
            }).toThrow(LensUrlError)
        })

        it('should throw on invalid protocol', () => {
            expect(() => {
                parser.parseUrl('ht:/example.com')
            }).toThrow(LensUrlError)
        })

        it('parses single url', () => {
            const urls = parser.parseUrl('https://example.com')

            expect(urls).toStrictEqual([
                new URL('https://example.com')
            ])
        })

        it('parses multiple urls', () => {
            const urls = parser.parseUrl('https://example.com http://example.com/subpage')

            expect(urls).toStrictEqual([
                new URL('https://example.com'),
                new URL('http://example.com/subpage')
            ])
        })
    })

    describe('parse', () => {
        it('parses all arguments at once', () => {
            const args: LensArguments = {
                _: [],
                $0: '',

                url: 'https://example.com',
                resolution: '1280x720',
                tag: 'custom tag',

                outputDir: './screenshots'
            }

            const parsedArgs = parser.parse(args)

            expect(parsedArgs).toStrictEqual({
                urls: parser.parseUrl('https://example.com'),
                resolutions: parser.parseResolution('1280x720'),
                tag: 'custom tag',

                outputDir: parser.parseDirectory(args.outputDir)
            })
        })
    })
})
