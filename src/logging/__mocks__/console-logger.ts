/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { LogLevel } from '@/logging/log-level'
import { Logger } from '@/typings/logging'

export default class ConsoleLogger implements Logger {
    public error (message: string): void {
    }

    public header (message: string, level: LogLevel = LogLevel.Info): void {
    }

    public info (message: string): void {
    }

    public success (message: string): void {
    }
}

