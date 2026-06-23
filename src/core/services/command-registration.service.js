import { REST, Routes } from 'discord.js'

const registerCommands = async ({ restVersion, token, clientId }, logger, commands) => {
	const commandCount = commands.length

	if (commandCount === 0) {
		logger.info('📝 No commands to register.')
		return
	}

	logger.info('📝 Registering application command(s)...')

	const rest = new REST({ version: restVersion }).setToken(token)

	await rest.put(Routes.applicationCommands(clientId), { body: commands })

	logger.info('✅ Successfully registered application command(s).')
}

export default registerCommands
