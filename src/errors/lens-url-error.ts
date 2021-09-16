import { LensError } from '@/errors/lens-error'

class LensUrlError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensUrlError'
    }
}

export {
    LensUrlError
}
