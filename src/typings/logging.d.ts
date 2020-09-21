interface Logger {
    error (message: string): void
    header (message: string): void
    info (message: string): void
    success (message: string): void
}

export {
    Logger
}
