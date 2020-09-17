import ExitCode from '@/enums/exit-code'

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
    LensUrlError
}
