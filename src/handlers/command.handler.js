import { Collection } from 'discord.js'
import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export class CommandHandler {
	constructor(client, logger) {
		this.client = client
		this.logger = logger
		this.client.commands = new Collection()
	}

	async load() {
		const commandFiles = await fastGlob(FILE_PATTERNS.COMMANDS, {
			cwd: process.cwd(),
			absolute: true,
			ignore: ['**/node_modules/**'],
		})

		let loadedCount = 0

		for (const file of commandFiles) {
			try {
				const fileUrl = pathToFileURL(file)
				const { default: CommandClass } = await import(fileUrl.href)

				if (CommandClass) {
					const command = new CommandClass()
					this.client.commands.set(command.data.name, command)
					loadedCount++
				} else {
					this.logger.warn(`| Skipping file ${file}: no default export.`)
				}
			} catch (error) {
				this.logger.warn(`| Skipping file ${file}: ${error.message}`)
			}
		}

		this.logger.info(`| Successfully loaded ${loadedCount} of ${commandFiles.length} commands`)
	}
}
