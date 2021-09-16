import { LensResolutionError, LensError } from '@/errors'

describe('LensResolutionError', (): void => {
    it('should be instance of LensError', (): void => {
        const error = new LensResolutionError()

        expect(error).toBeInstanceOf(LensError)
    })

    it('should have correct name', (): void => {
        const error = new LensResolutionError()

        expect(error.name).toBe('LensResolutionError')
    })
})
