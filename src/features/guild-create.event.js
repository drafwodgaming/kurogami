import serverLocaleShema from '../schemas/server-locale.schema.js'

export default class GuildCreate {
	name = 'guildCreate'
	once = false
	async execute(guild) {
		await serverLocaleShema.updateOne(
			{ Guild: guild.id },
			{ $set: { Language: 'en' } },
			{ upsert: true }
		)
	}
}
