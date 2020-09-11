import chalk from 'chalk'
import boxen from 'boxen'

import { Logger } from './typings/types'

class ConsoleLogger implements Logger {
    public error (message: string): void {
        console.error(chalk.red(message))
    }

    public header (message: string): void {
        console.log(chalk.cyan(boxen(message, {
            borderStyle: boxen.BorderStyle.Round
        })))
    }

    public info (message: string): void {
        console.info(chalk.blue(message))
    }

    public success (message: string): void {
        console.info(chalk.yellowBright(message))
    }
}

export {
    ConsoleLogger
}
