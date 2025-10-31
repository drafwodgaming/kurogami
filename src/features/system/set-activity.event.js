import { ActivityType } from 'discord.js'

export default class SetActivity {
	name = 'clientReady'
	once = true
	async execute(client) {
		const presenceUpdateIntervalMs = 45_000
		let activityIndex = 0

		const updatePresence = async () => {
			await client.guilds.fetch()
			let totalMembers = 0
			for (const guild of client.guilds.cache.values()) {
				totalMembers += guild.memberCount || guild.members.cache.size > 0
			}

			const activities = [
				{
					name: `Made by drafwod | Invite me`,
					type: ActivityType.Custom,
				},
				{
					name: `${client.guilds.cache.size} 寺 | Temples`,
					type: ActivityType.Watching,
				},
				{
					name: `☁️ Stormgazing`,
					type: ActivityType.Playing,
				},
				{
					name: `/help | ${totalMembers} souls`,
					type: ActivityType.Watching,
				},
			]

			const activity = activities[activityIndex]

			if (client.user) {
				await client.user.setActivity(activity)
			}

			activityIndex = (activityIndex + 1) % activities.length
		}

		await updatePresence()
		setInterval(updatePresence, presenceUpdateIntervalMs)
	}
}
