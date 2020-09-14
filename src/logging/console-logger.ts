import chalk from 'chalk'
import boxen from 'boxen'

import { Logger } from '@/typings/types'

export default class ConsoleLogger implements Logger {
    public error (message: string): void {
        console.error(chalk.red(`[ERROR] ${message}`))
    }

    public header (message: string): void {
        console.log(chalk.cyan(boxen(message, {
            borderStyle: boxen.BorderStyle.Round,
            padding: {
                top: 0,
                right: 3,
                bottom: 0,
                left: 3
            }
        })))
    }

    public info (message: string): void {
        console.log(chalk.blue(`[INFO] ${message}`))
    }

    public success (message: string): void {
        console.log(chalk.greenBright(`[SUCCESS] ${message}`))
    }
}
