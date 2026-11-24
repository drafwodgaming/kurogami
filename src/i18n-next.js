import Backend from 'i18next-fs-backend'
import i18next from 'i18next'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const i18n = i18next.createInstance()

i18n.use(Backend).init({
	initImmediate: false,
	fallbackLng: 'en',
	supportedLngs: ['en', 'ru', 'uk'],
	preload: ['en', 'ru', 'uk'],
	backend: { loadPath: path.join(projectRoot, 'config/bot/languages/{{lng}}.json') },
	interpolation: { escapeValue: false },
})

export default i18n
