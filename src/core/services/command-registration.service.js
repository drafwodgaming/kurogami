import { REST, Routes } from 'discord.js'

export class CommandRegistrationService {
	constructor(config, logger) {
		this.config = config
		this.logger = logger
		this.rest = new REST({ version: config.restVersion }).setToken(config.token)
	}

	async registerCommands(commands) {
		if (!commands || commands.length === 0) {
			this.logger.info('📝 No commands to register')
			return
		}

		await this.rest.put(Routes.applicationCommands(this.config.clientId), {
			body: commands,
		})
	}
}
