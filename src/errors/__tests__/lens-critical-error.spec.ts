import { LensCriticalError, LensError } from '@/errors'
import { ExitCode } from '@/exit-code'

describe('LensCriticalError', (): void => {
    it('should be instance of LensError', (): void => {
        const error = new LensCriticalError('message')

        expect(error).toBeInstanceOf(LensError)
    })

    it('should have correct name', (): void => {
        const error = new LensCriticalError('message')

        expect(error.name).toBe('LensCriticalError')
    })

    it('should have generic error exit code by default', (): void => {
        const error = new LensCriticalError('message')

        expect(error.code).toBe(ExitCode.GenericLensError)
    })

    it('should set exit code from constructor', (): void => {
        const error = new LensCriticalError('message', ExitCode.InvalidInputDirectory)

        expect(error.code).toBe(ExitCode.InvalidInputDirectory)
    })
})
