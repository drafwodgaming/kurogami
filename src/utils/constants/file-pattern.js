import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export const FILE_PATTERNS = {
	COMMANDS: 'src/features/**/*.command.js',
	EVENTS: 'src/features/**/*.event.js',
	BUTTONS: 'src/features/**/*.button.js',
	MENUS: 'src/features/**/*.menu.js',
	MODALS: 'src/features/**/*.modal.js',
}
