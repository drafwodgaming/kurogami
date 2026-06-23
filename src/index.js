import startBot from './core/discord-bot.js'
import createLogger from './core/services/logger.service.js'
import dotenv from 'dotenv'

dotenv.config()

const prefix = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const REQUIRED_ENV = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'MONGO_URL']

REQUIRED_ENV.forEach(key => {
	process.env[key] = process.env[`${prefix}_${key}`]
})

const logger = createLogger(process.env.LOG_LEVEL || 'info')

const missing = REQUIRED_ENV.filter(k => !process.env[k])
if (missing.length > 0) {
	logger.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
	process.exit(1)
}

await startBot(logger)
