import each from 'jest-each'

import ConsoleLogger from '@/logging/console-logger'
import { LogLevel } from '@/logging/log-level'

describe('ConsoleLogger', () => {
    let logger: ConsoleLogger
    let spy: jest.SpyInstance | undefined

    beforeEach(() => {
        logger = new ConsoleLogger()
    })

    afterEach(() => {
        spy?.mockRestore()
    })

    it('prints error message', () => {
        spy = jest.spyOn(console, 'error').mockImplementation()

        expect(() => {
            logger.error('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    each([
        [LogLevel.Info, 'log'],
        [LogLevel.Error, 'error'],
        [LogLevel.Critical, 'error'],

        // No param passed
        [undefined, 'log'],

        // Some weird, unknown case
        [5, 'log']
    ]).it('prints header with LogLevel = %s', (logLevel: LogLevel, method: jest.FunctionPropertyNames<typeof console>) => {
        spy = jest.spyOn(console, method).mockImplementation()

        expect(() => {
            logger.header('Message', logLevel)
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    it('prints info message', () => {
        spy = jest.spyOn(console, 'log').mockImplementation()

        expect(() => {
            logger.info('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    it('print success message', () => {
        spy = jest.spyOn(console, 'log').mockImplementation()

        expect(() => {
            logger.success('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })
})
