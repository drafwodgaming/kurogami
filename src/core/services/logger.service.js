import chalk from 'chalk'
import winston from 'winston'

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
}

const colors = {
	error: chalk.bold.red,
	warn: chalk.bold.yellow,
	info: chalk.bold.green,
	debug: chalk.bold.magenta,
}

const format = winston.format.combine(
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.timestamp({ format: 'HH:mm:ss' }),
	winston.format.printf(({ timestamp, level, message, stack }) => {
		const color = colors[level] ?? chalk.white
		const stackTrace = stack ? `\n${chalk.gray(stack)}` : ''

		return `${chalk.gray(timestamp)} ${chalk.gray(`[${level.toUpperCase()}]`)} ${color(message)}${stackTrace}`
	})
)

const createLogger = (level = 'info') =>
	winston.createLogger({
		levels,
		level: level.toLowerCase(),
		format,
		transports: [new winston.transports.Console()],
	})

export default createLogger
