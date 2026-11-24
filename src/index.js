import startBot from './core/discord-bot.js'
import createLogger from './core/services/logger.service.js'
import dotenv from 'dotenv'

dotenv.config()

const prefix = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const REQUIRED_ENV = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'MONGO_URL']

REQUIRED_ENV.forEach(key => {
	const value = process.env[`${prefix}_${key}`]
	if (value) process.env[key] = value
})

const logger = createLogger('info')

const missing = REQUIRED_ENV.filter(key => !process.env[key])
if (missing.length > 0) {
	logger.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
	process.exit(1)
}

await startBot(logger)
