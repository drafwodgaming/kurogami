import locale from '../../schemas/server-locale.schema.js'

const getGuildLanguage = async guildId => (await locale.findOne({ Guild: guildId }))?.Language

export { getGuildLanguage }
