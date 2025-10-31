import chalk from 'chalk'
import winston from 'winston'

const { combine, timestamp, printf, errors, splat } = winston.format

export class LoggerService {
	static levelStyles = {
		error: { priority: 0, color: chalk.bold.red },
		warn: { priority: 1, color: chalk.bold.yellow },
		info: { priority: 2, color: chalk.bold.green },
		debug: { priority: 3, color: chalk.bold.magenta },
	}

	constructor(level = 'info') {
		const winstonLevels = Object.fromEntries(
			Object.entries(LoggerService.levelStyles).map(([levelName, config]) => [
				levelName,
				config.priority,
			])
		)

		const consoleFormat = combine(
			errors({ stack: true }),
			splat(),
			timestamp({ format: 'HH:mm:ss' }),
			printf(({ timestamp: ts, level: logLevel, message, stack }) => {
				const style = LoggerService.levelStyles[logLevel]
				const coloredTimestamp = chalk.gray(ts)
				const formattedMessage = style.color(message)
				const stackString = stack ? `\n${chalk.gray(stack)}` : ''

				return `${coloredTimestamp} ${formattedMessage}${stackString}`
			})
		)

		this.logger = winston.createLogger({
			levels: winstonLevels,
			level: level.toLowerCase(),
			transports: [new winston.transports.Console({ format: consoleFormat })],
		})
	}

	error = (message, ...data) => this.logger.error(message, ...data)
	warn = (message, ...data) => this.logger.warn(message, ...data)
	info = (message, ...data) => this.logger.info(message, ...data)
	debug = (message, ...data) => this.logger.debug(message, ...data)
}
