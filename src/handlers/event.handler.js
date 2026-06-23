import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export async function loadEvents(client, logger, context) {
	const eventFiles = await fastGlob(FILE_PATTERNS.EVENTS, {
		cwd: process.cwd(),
		absolute: true,
		ignore: ['**/node_modules/**'],
	})

	let loadedCount = 0

	for (const file of eventFiles) {
		try {
			const fileUrl = pathToFileURL(file)
			const { default: event } = await import(fileUrl.href)

			if (event && event.name) {
				const eventMethod = event.once ? 'once' : 'on'
				client[eventMethod](event.name, async (...args) => {
					await event.execute(...args, context)
				})

				logger.debug(`| Event loaded: ${event.name} (one-time: ${!!event.once})`)
				loadedCount++
			} else {
				logger.warn(`| Skipping file ${file}: no default export.`)
			}
		} catch (error) {
			logger.warn(`| Skipping file ${file}: ${error.message}`)
		}
	}

	logger.info(`| Successfully loaded ${loadedCount} of ${eventFiles.length} events.`)
}
