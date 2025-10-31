import { getGuildLanguage } from './get-guild-language.js'
import i18n from '../../i18n-next.js'

export const getLocalizedText = async interaction => {
	const id = interaction.guild?.id || interaction.user?.id
	const lang = await getGuildLanguage(id)

	return (key, options) => i18n.t(key, { lng: lang, ...options })
}
