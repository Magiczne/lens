class LensError extends Error {
    constructor (message: string) {
        super(message)

        this.name = 'LensError'
    }
}

class LensResolutionError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensResolutionError'
    }
}

export {
    LensError,
    LensResolutionError
}
