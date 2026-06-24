import { Client, GatewayIntentBits } from 'discord.js'
import { loadCommands } from '../handlers/command.handler.js'
import { loadComponents } from '../handlers/component.handler.js'
import { loadEvents } from '../handlers/event.handler.js'
import dbService from './services/mongo/database.service.js'
import registerCommands from './services/command-registration.service.js'

const INTENTS = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.DirectMessages,
]

const getConfig = () => ({
	token: process.env.DISCORD_TOKEN,
	clientId: process.env.DISCORD_CLIENT_ID,
	restVersion: process.env.REST_VERSION,
	mongoUrl: process.env.MONGO_URL,
})

const createShutdown = (client, logger) => {
	let isShuttingDown = false

	return async (reason = 'unknown') => {
		if (isShuttingDown) return
		isShuttingDown = true

		process.stdout.write('\n')
		logger.warn(`🔥 Shutting down... Reason: ${reason}`)

		await dbService.disconnect()
		await client.destroy()
		logger.info('✅ Bot shut down successfully')

		await new Promise(resolve => setTimeout(resolve, 200))
		process.exit(reason === 'startup_error' ? 1 : 0)
	}
}

const setupProcessListeners = (shutdown, logger) => {
	process.once('SIGINT', () => shutdown('SIGINT'))
	process.once('SIGTERM', () => shutdown('SIGTERM'))
	process.on('unhandledRejection', error => {
		logger.error('❌ Unhandled Rejection:', error)
		shutdown('unhandled_rejection')
	})
	process.on('uncaughtException', error => {
		logger.error('❌ Uncaught Exception:', error)
		shutdown('uncaught_exception')
	})
}

const startBot = async logger => {
	logger.info('🚀 Starting Discord Bot...')

	const config = getConfig()
	const client = new Client({ intents: INTENTS })
	const shutdown = createShutdown(client, logger)

	setupProcessListeners(shutdown)

	const [commands, components] = await Promise.all([
		loadCommands(logger),
		loadComponents(logger),
		dbService.connect(config.mongoUrl, logger),
	])

	await loadEvents(client, logger, { commands, ...components })

	const commandData = [...commands.values()].map(c => c.data)
	if (commandData.length > 0) {
		await registerCommands(config, logger, commandData)
	}

	await client.login(config.token)
	logger.info(`✅ Bot started as ${client.user?.displayName}`)
}

export default startBot
