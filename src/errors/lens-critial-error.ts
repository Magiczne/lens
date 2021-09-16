import ExitCode from '@/exit-code'
import { LensError } from '@/errors/lens-error'

class LensCriticalError extends LensError {
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
