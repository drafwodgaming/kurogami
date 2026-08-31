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

	return async reason => {
		if (isShuttingDown) return
		isShuttingDown = true

		logger.warn(`Shutting down... Reason: ${reason}`)

		await Promise.allSettled([dbService.disconnect(), client.destroy()])

		logger.info('Bot shut down successfully')
		process.exit(0)
	}
}

const setupProcessListeners = (shutdown, logger) => {
	process.once('SIGINT', () => shutdown('SIGINT'))
	process.once('SIGTERM', () => shutdown('SIGTERM'))

	process.on('unhandledRejection', error => {
		logger.error('Unhandled Rejection:', error)
		shutdown('unhandled_rejection')
	})

	process.on('uncaughtException', error => {
		logger.error('Uncaught Exception:', error)
		shutdown('uncaught_exception')
	})
}

const loadBotData = async (config, logger) => {
	const [commands, components] = await Promise.all([
		loadCommands(logger),
		loadComponents(logger),
		dbService.connect(config.mongoUrl, logger),
	])

	return { commands, components }
}

const startBot = async logger => {
	logger.info('Starting Discord Bot...')

	const config = getConfig()
	const client = new Client({ intents: INTENTS })
	const shutdown = createShutdown(client, logger)

	setupProcessListeners(shutdown, logger)

	const { commands, components } = await loadBotData(config, logger)

	await loadEvents(client, logger, { commands, ...components })

	const commandData = [...commands.values()].map(command => command.data)

	if (commandData.length) {
		await registerCommands(config, logger, commandData)
	}

	await client.login(config.token)

	logger.info(`Bot started as ${client.user?.displayName ?? client.user?.username}`)
}

export default startBot
