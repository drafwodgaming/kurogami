import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export class EventHandler {
	constructor(client, logger) {
		this.client = client
		this.logger = logger
	}

	async load() {
		const eventFiles = await fastGlob(FILE_PATTERNS.EVENTS, {
			cwd: process.cwd(),
			absolute: true,
			ignore: ['**/node_modules/**'],
		})

		let loadedCount = 0

		for (const file of eventFiles) {
			try {
				const fileUrl = pathToFileURL(file)
				const { default: EventClass } = await import(fileUrl.href)

				if (EventClass) {
					const event = new EventClass()

					const eventMethod = event.once ? 'once' : 'on'
					this.client[eventMethod](event.name, async (...args) => {
						await event.execute(...args)
					})

					this.logger.debug(`| Event loaded: ${event.name} (one-time: ${!!event.once})`)
					loadedCount++
				} else {
					this.logger.warn(`| Skipping file ${file}: no default export.`)
				}
			} catch (error) {
				this.logger.warn(`| Skipping file ${file}: ${error.message}`)
			}
		}

		this.logger.info(`| Successfully loaded ${loadedCount} of ${eventFiles.length} events.`)
	}
}
