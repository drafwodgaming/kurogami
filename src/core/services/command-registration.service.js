import { REST, Routes } from 'discord.js'

const registerCommands = async ({ restVersion, token, clientId }, logger, commands) => {
	if (!commands.length) {
		logger.debug('No commands to register')
		return
	}

	logger.info(`Registering ${commands.length} application command(s)...`)

	const rest = new REST({ version: restVersion }).setToken(token)

	await rest.put(Routes.applicationCommands(clientId), {
		body: commands,
	})

	logger.info(`Successfully registered ${commands.length} application command(s)`)
}

export default registerCommands
