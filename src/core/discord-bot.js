// core/discord-bot.js
import { Client, GatewayIntentBits } from 'discord.js'
import { createAllHandlers } from './factories/handler-factory.js'

export class DiscordBot {
	constructor({ config, logger, databaseService, commandRegistrationService }) {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.DirectMessages,
			],
		})

		this.config = config
		this.logger = logger
		this.databaseService = databaseService
		this.commandRegistrationService = commandRegistrationService
		this.client.logger = logger

		this.#setupHandlers()
		this.#setupProcessEventListeners()
	}

	#setupHandlers() {
		this.client.handlers = createAllHandlers(this.client, this.logger)
	}

	async start() {
		try {
			this.logger.info('🚀 Starting Discord Bot...')
			await this.databaseService.connect()
			await this.#loadHandlers()
			if (this.client.commands && this.client.commands.size > 0) {
				const commandsToRegister = [...this.client.commands.values()].map(command => command.data)

				await this.commandRegistrationService.registerCommands(commandsToRegister)
			}

			await this.client.login(this.config.token)

			this.logger.info(`✅ Bot started successfully as ${this.client.user?.displayName}`)
		} catch (error) {
			this.logger.error('❌ Failed to start bot:', error)
			await this.shutdown('startup_error')
		}
	}

	async #loadHandlers() {
		const { events, commands, components } = this.client.handlers
		await Promise.all([events.load(), commands.load(), components.load()])
	}

	async shutdown(reason = 'unknown') {
		this.logger.warn(`🔥 Shutting down Discord Bot... Reason: ${reason}`)

		if (this.client) {
			await this.client.destroy()
		}

		if (this.databaseService) {
			await this.databaseService.disconnect()
		}

		this.logger.info('✅ Bot has been shut down successfully.')

		process.exit(reason === 'startup_error' ? 1 : 0)
	}

	#setupProcessEventListeners() {
		process.on('SIGINT', () => this.shutdown('SIGINT'))
		process.on('SIGTERM', () => this.shutdown('SIGTERM'))
		process.on('unhandledRejection', error => {
			this.logger.error('❌ Unhandled Rejection:', error)
			this.shutdown('unhandled_rejection')
		})
		process.on('uncaughtException', error => {
			this.logger.error('❌ Uncaught Exception:', error)
			this.shutdown('uncaught_exception')
		})
	}
}
