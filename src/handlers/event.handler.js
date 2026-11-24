import { FILE_PATTERNS, PROJECT_ROOT } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export async function loadEvents(client, logger, context) {
	const eventFiles = await fastGlob(FILE_PATTERNS.EVENTS, {
		cwd: PROJECT_ROOT,
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
					try {
						await event.execute(...args, context)
					} catch (error) {
						logger.error(`Event ${event.name} failed:`, error)
					}
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
