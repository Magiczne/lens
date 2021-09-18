import { LensUrlError, LensError } from '@/errors'

describe('LensUrlError', (): void => {
    it('should be instance of LensError', (): void => {
        const error = new LensUrlError()

        expect(error).toBeInstanceOf(LensError)
    })

    it('should have correct name', (): void => {
        const error = new LensUrlError()

        expect(error.name).toBe('LensUrlError')
    })
})
