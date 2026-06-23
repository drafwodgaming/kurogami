import serverLocaleShema from '../schemas/server-locale.schema.js'

const guildCreateEvent = {
	name: 'guildCreate',
	once: false,
	async execute(guild) {
		await serverLocaleShema.updateOne(
			{ Guild: guild.id },
			{ $set: { Language: 'en' } },
			{ upsert: true }
		)
	},
}

export default guildCreateEvent
