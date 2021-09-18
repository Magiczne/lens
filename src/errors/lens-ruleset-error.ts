import { LensError } from '@/errors/lens-error'
import { ValidationError } from 'yup'

class LensRulesetError extends LensError {
    name = 'LensRulesetError'
    validationError: ValidationError

    constructor (validationError: ValidationError, file: string) {
        super(`Ruleset ${file} contains errors`)

        this.validationError = validationError
    }
}

export {
    LensRulesetError
}
