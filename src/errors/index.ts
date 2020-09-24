import { ValidationError } from 'yup'

import ExitCode from '@/exit-code'

class LensError extends Error {
    constructor (message: string) {
        super(message)

        this.name = 'LensError'
    }
}

class LensCriticalError extends Error {
    code: ExitCode

    constructor (message: string, code: ExitCode = ExitCode.GenericLensError) {
        super(message)

        this.code = code
        this.name = 'LensCriticalError'
    }
}

class LensResolutionError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensResolutionError'
    }
}

class LensRulesetError extends LensError {
    validationError: ValidationError

    constructor (validationError: ValidationError, file: string) {
        super(`Ruleset ${file} contains errors`)

        this.validationError = validationError
        this.name = 'LensRulesetError'
    }
}

class LensUrlError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensUrlError'
    }
}

export {
    LensError,
    LensCriticalError,
    LensResolutionError,
    LensRulesetError,
    LensUrlError
}
