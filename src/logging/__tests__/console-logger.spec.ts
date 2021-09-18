import ConsoleLogger from '@/logging/console-logger'
import { LogLevel } from '@/logging/log-level'

type ConsoleMethod = jest.FunctionPropertyNames<typeof console>

describe('ConsoleLogger', () => {
    let logger: ConsoleLogger
    let spy: jest.SpyInstance | undefined

    beforeEach(() => {
        logger = new ConsoleLogger()
    })

    afterEach(() => {
        spy?.mockRestore()
    })

    describe('error', (): void => {
        it('prints error message', () => {
            spy = jest.spyOn(console, 'error').mockImplementation()

            expect(() => {
                logger.error('Message')
            }).not.toThrow()

            expect(spy).toBeCalledTimes(1)
        })
    })

    describe('header', (): void => {
        const testCases = [
            [LogLevel.Info, 'log'],
            [LogLevel.Error, 'error'],
            [LogLevel.Critical, 'error'],

            // No param passed
            [undefined, 'log'],

            // Some weird, unknown case
            [5, 'log'] as unknown as [LogLevel, ConsoleMethod]
        ] as Array<[LogLevel, ConsoleMethod]>

        test.each(testCases)('prints header with LogLevel = %s', (logLevel: LogLevel | undefined, method: ConsoleMethod) => {
            spy = jest.spyOn(console, method).mockImplementation()

            expect(() => {
                logger.header('Message', logLevel)
            }).not.toThrow()

            expect(spy).toBeCalledTimes(1)
        })
    })

    describe('info', (): void => {
        it('prints info message', () => {
            spy = jest.spyOn(console, 'log').mockImplementation()

            expect(() => {
                logger.info('Message')
            }).not.toThrow()

            expect(spy).toBeCalledTimes(1)
        })
    })

    describe('success', (): void => {
        it('print success message', () => {
            spy = jest.spyOn(console, 'log').mockImplementation()

            expect(() => {
                logger.success('Message')
            }).not.toThrow()

            expect(spy).toBeCalledTimes(1)
        })
    })
})
