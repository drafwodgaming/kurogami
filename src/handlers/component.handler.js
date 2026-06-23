import { Collection } from 'discord.js'
import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

async function loadComponentType(logger, collection, pattern, componentName) {
	const componentFiles = await fastGlob(pattern, {
		cwd: process.cwd(),
		absolute: true,
		ignore: ['**/node_modules/**'],
	})

	let loadedCount = 0

	for (const file of componentFiles) {
		try {
			const fileUrl = pathToFileURL(file)
			const { default: component } = await import(fileUrl.href)

			if (component && component.id) {
				collection.set(component.id, component)
				loadedCount++
			} else {
				logger.warn(`| Skipping file ${file}: no default export.`)
			}
		} catch (error) {
			logger.warn(`| Skipping file ${file}: ${error.message}`)
		}
	}

	logger.info(
		`| ${componentName}: ${loadedCount} of ${componentFiles.length} were successfully loaded.`
	)
}

export async function loadComponents(logger) {
	const buttons = new Collection()
	const selectMenus = new Collection()
	const modals = new Collection()

	const componentTypes = [
		{ collection: buttons, pattern: FILE_PATTERNS.BUTTONS, name: 'Buttons' },
		{ collection: selectMenus, pattern: FILE_PATTERNS.MENUS, name: 'Menus' },
		{ collection: modals, pattern: FILE_PATTERNS.MODALS, name: 'Modals' },
	]

	await Promise.all(
		componentTypes.map(({ collection, pattern, name }) =>
			loadComponentType(logger, collection, pattern, name)
		)
	)

	logger.info('| All components are loaded.')

	return { buttons, selectMenus, modals }
}
