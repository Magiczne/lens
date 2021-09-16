import ExitCode from '@/exit-code'

class LensCriticalError extends Error {
    code: ExitCode
    name = 'LensCriticalError'

    constructor (message: string, code: ExitCode = ExitCode.GenericLensError) {
        super(message)

        this.code = code
    }
}

export {
    LensCriticalError
}
