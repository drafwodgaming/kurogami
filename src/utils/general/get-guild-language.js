import locale from '../../schemas/server-locale.schema.js'

const DEFAULT_LANGUAGE = 'en'

const getGuildLanguage = async guildId => {
	if (!guildId) return DEFAULT_LANGUAGE

	return (await locale.findOne({ Guild: guildId }).lean())?.Language || DEFAULT_LANGUAGE
}

export default getGuildLanguage
