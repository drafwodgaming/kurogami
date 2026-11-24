import serverLocaleSchema from '../schemas/server-locale.schema.js'

const guildCreateEvent = {
	name: 'guildCreate',
	once: false,
	async execute(guild) {
		await serverLocaleSchema.updateOne(
			{ Guild: guild.id },
			{ $setOnInsert: { Language: 'en' } },
			{ upsert: true }
		)
	},
}

export default guildCreateEvent
