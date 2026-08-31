import { ActivityType } from 'discord.js'

const PRESENCE_INTERVAL = 45_000

const setActivityEvent = {
	name: 'clientReady',
	once: true,

	execute(client) {
		let activityIndex = 0

		const updatePresence = () => {
			const guilds = client.guilds.cache

			const totalMembers = guilds.reduce((total, guild) => total + guild.memberCount, 0)

			const activities = [
				{
					name: 'Made by drafwod | Invite me',
					type: ActivityType.Custom,
				},
				{
					name: `${guilds.size} 寺 | Temples`,
					type: ActivityType.Watching,
				},
				{
					name: '☁️ Stormgazing',
					type: ActivityType.Playing,
				},
				{
					name: `/help | ${totalMembers} souls`,
					type: ActivityType.Watching,
				},
			]

			client.user.setActivity(activities[activityIndex])

			activityIndex = (activityIndex + 1) % activities.length
		}

		updatePresence()
		setInterval(updatePresence, PRESENCE_INTERVAL)
	},
}

export default setActivityEvent
