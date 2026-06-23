import { Collection } from 'discord.js'
import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export async function loadCommands(logger) {
	const commands = new Collection()
	const commandFiles = await fastGlob(FILE_PATTERNS.COMMANDS, {
		cwd: process.cwd(),
		absolute: true,
		ignore: ['**/node_modules/**'],
	})

	let loadedCount = 0

	for (const file of commandFiles) {
		try {
			const fileUrl = pathToFileURL(file)
			const { default: command } = await import(fileUrl.href)

			if (command && command.data) {
				commands.set(command.data.name, command)
				loadedCount++
			} else {
				logger.warn(`| Skipping file ${file}: no default export.`)
			}
		} catch (error) {
			logger.warn(`| Skipping file ${file}: ${error.message}`)
		}
	}

	logger.info(`| Successfully loaded ${loadedCount} of ${commandFiles.length} commands`)
	return commands
}
