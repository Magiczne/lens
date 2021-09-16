import { LensError } from '@/errors'

describe('LensError', (): void => {
    it('should be instance of Error', (): void => {
        const error = new LensError()

        expect(error).toBeInstanceOf(Error)
    })

    it('should have correct name', (): void => {
        const error = new LensError()

        expect(error.name).toBe('LensError')
    })
})
