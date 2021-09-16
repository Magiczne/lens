import ExitCode from '@/exit-code'

class LensCriticalError extends Error {
    code: ExitCode

    constructor (message: string, code: ExitCode = ExitCode.GenericLensError) {
        super(message)

        this.code = code
        this.name = 'LensCriticalError'
    }
}

export {
    LensCriticalError
}
