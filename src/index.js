import { CommandRegistrationService } from './core/services/command-registration.service.js'
import { DatabaseService } from './core/services/database.service.js'
import { DiscordBot } from './core/discord-bot.js'
import { LoggerService } from './core/services/logger.service.js'
import dotenv from 'dotenv'

dotenv.config()

const logger = new LoggerService(process.env.LOG_LEVEL || 'info')

async function main() {
	const config = {
		token: process.env.DISCORD_TOKEN,
		clientId: process.env.DISCORD_CLIENT_ID,
		restVersion: process.env.REST_VERSION,
	}

	const databaseService = new DatabaseService(process.env.MONGO_URL, logger)
	const commandRegistrationService = new CommandRegistrationService(config, logger)

	const bot = new DiscordBot({
		config,
		logger,
		databaseService,
		commandRegistrationService,
	})

	await bot.start()
}

main()
