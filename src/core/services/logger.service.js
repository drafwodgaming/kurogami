import chalk from 'chalk'
import winston from 'winston'

const { combine, timestamp, printf, errors, splat } = winston.format

const LEVEL_STYLES = {
	error: { priority: 0, color: chalk.bold.red },
	warn: { priority: 1, color: chalk.bold.yellow },
	info: { priority: 2, color: chalk.bold.green },
	debug: { priority: 3, color: chalk.bold.magenta },
}

const WINSTON_LEVELS = Object.fromEntries(
	Object.entries(LEVEL_STYLES).map(([name, { priority }]) => [name, priority])
)

const consoleFormat = combine(
	errors({ stack: true }),
	splat(),
	timestamp({ format: 'HH:mm:ss' }),
	printf(({ timestamp: ts, level, message, stack }) => {
		const style = LEVEL_STYLES[level] ?? { color: chalk.white }
		const tag = chalk.gray(`[${level.toUpperCase()}]`)
		const stackStr = stack ? `\n${chalk.gray(stack)}` : ''
		return `${chalk.gray(ts)} ${tag} ${style.color(message)}${stackStr}`
	})
)

const createLogger = (level = 'info') => {
	return winston.createLogger({
		levels: WINSTON_LEVELS,
		level: level.toLowerCase(),
		transports: [new winston.transports.Console({ format: consoleFormat })],
	})
}

export default createLogger
