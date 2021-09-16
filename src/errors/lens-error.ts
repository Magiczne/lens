class LensError extends Error {
    constructor (message: string) {
        super(message)

        this.name = 'LensError'
    }
}

export {
    LensError
}
