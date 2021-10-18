import { LogLevel } from '@/logging/log-level'

interface Logger {
    /**
     * Log error message
     *
     * @param message Message to be logged
     */
    error (message: string): void

    /**
     * Log header
     *
     * @param message Header content
     * @param level Logging level
     */
    header (message: string, level?: LogLevel): void

    /**
     * Log info message
     *
     * @param message Message to be logged
     */
    info (message: string): void

    /**
     * Log success message
     *
     * @param message Message to be logged
     */
    success (message: string): void
}

export {
    Logger
}
