import boxen from 'boxen'
import chalk from 'chalk'

import { LogLevel } from '@/logging/log-level'
import { Logger } from '@/typings/types'

export default class ConsoleLogger implements Logger {
    public error (message: string): void {
        console.error(chalk.red(`[ERROR] ${message}`))
    }

    public header (message: string, level: LogLevel = LogLevel.Info): void {
        const box = boxen(message, {
            borderStyle: 'double',
            padding: {
                top: level === LogLevel.Critical ? 1 : 0,
                right: 3,
                bottom: level === LogLevel.Critical ? 1 : 0,
                left: 3
            }
        })

        switch (level) {
            case LogLevel.Error:
                console.error(chalk.redBright(box))
                break

            case LogLevel.Critical:
                console.error(chalk.redBright(box))
                break

            case LogLevel.Info:
                console.log(chalk.cyan(box))
                break

            default:
                console.log(chalk.white(box))
        }
    }

    public info (message: string): void {
        console.log(chalk.blue(`[INFO] ${message}`))
    }

    public success (message: string): void {
        console.log(chalk.greenBright(`[SUCCESS] ${message}`))
    }
}
