import { LensError } from '@/errors/lens-error'

class LensResolutionError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensResolutionError'
    }
}

export {
    LensResolutionError
}
