import { ValidationError } from 'yup'

import { LensRulesetError, LensError } from '@/errors'

describe('LensRulesetError', (): void => {
    it('should be instance of LensError', (): void => {
        const error = new LensRulesetError(new ValidationError('error'), 'file.js')

        expect(error).toBeInstanceOf(LensError)
    })

    it('should have correct name', (): void => {
        const error = new LensRulesetError(new ValidationError('error'), 'file.js')

        expect(error.name).toBe('LensRulesetError')
    })

    it('should set validation error and message', (): void => {
        const validationError = new ValidationError('error')
        const error = new LensRulesetError(validationError, 'file.js')

        expect(error.validationError).toEqual(validationError)
        expect(error.message).toBe(`Ruleset file.js contains errors`)
    })
})
