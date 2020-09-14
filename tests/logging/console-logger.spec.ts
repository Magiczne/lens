import ConsoleLogger from '@/logging/console-logger'

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
        spy = jest.spyOn(console, 'error')
            .mockImplementation()

        expect(() => {
            logger.error('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    it('prints header', () => {
        spy = jest.spyOn(console, 'log')
            .mockImplementation()

        expect(() => {
            logger.header('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    it('prints info message', () => {
        spy = jest.spyOn(console, 'log')
            .mockImplementation()

        expect(() => {
            logger.info('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })

    it('print success message', () => {
        spy = jest.spyOn(console, 'log')
            .mockImplementation()

        expect(() => {
            logger.success('Message')
        }).not.toThrow()

        expect(spy).toBeCalledTimes(1)
    })
})
