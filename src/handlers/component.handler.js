import { Collection } from 'discord.js'
import { FILE_PATTERNS } from '../utils/constants/file-pattern.js'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'node:url'

export class ComponentHandler {
	constructor(client, logger) {
		this.client = client
		this.logger = logger
		this.client.buttons = new Collection()
		this.client.selectMenus = new Collection()
		this.client.modals = new Collection()
	}

	async load() {
		const components = [
			{ key: 'buttons', pattern: FILE_PATTERNS.BUTTONS, name: 'Buttons' },
			{ key: 'selectMenus', pattern: FILE_PATTERNS.MENUS, name: 'Menus' },
			{ key: 'modals', pattern: FILE_PATTERNS.MODALS, name: 'Modals' },
		]

		for (const { key, pattern, name } of components) {
			await this.loadComponent(key, pattern, name)
		}

		this.logger.info('| All components are loaded.')
	}

	async loadComponent(clientKey, pattern, componentName) {
		const componentFiles = await fastGlob(pattern, {
			cwd: process.cwd(),
			absolute: true,
			ignore: ['**/node_modules/**'],
		})

		let loadedCount = 0

		for (const file of componentFiles) {
			try {
				const fileUrl = pathToFileURL(file)
				const { default: ComponentClass } = await import(fileUrl.href)

				if (ComponentClass) {
					const component = new ComponentClass()
					this.client[clientKey].set(component.id, component)
					loadedCount++
				} else {
					this.logger.warn(`| Skipping file ${file}: no default export.`)
				}
			} catch (error) {
				this.logger.warn(`| Skipping file ${file}: ${error.message}`)
			}
		}

		this.logger.info(
			`| ${componentName}: ${loadedCount} of ${componentFiles.length} were successfully loaded.`
		)
	}
}
