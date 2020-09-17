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

class LensUrlError extends LensError {
    constructor (message: string) {
        super(message)

        this.name = 'LensUrlError'
    }
}

export {
    LensError,
    LensResolutionError
    LensResolutionError,
    LensUrlError
}
