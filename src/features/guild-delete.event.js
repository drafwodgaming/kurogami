import leaveChannelSchema from '../schemas/leave-channel.schema.js'
import serverlocaleSchema from '../schemas/server-locale.schema.js'
import voiceHubCreatorSchema from '../schemas/voice-hub.schema.js'
import voiceTempChannelSchema from '../schemas/voice-temp-channel.schema.js'
import welcomeChannelSchema from '../schemas/welcome-channel.schema.js'

export default class GuildDelete {
	name = 'guildDelete'
	once = false
	async execute(guild) {
		const guildId = guild.id

		await Promise.all([
			voiceHubCreatorSchema.deleteMany({ Guild: guildId }),
			leaveChannelSchema.deleteMany({ Guild: guildId }),
			serverlocaleSchema.deleteMany({ Guild: guildId }),
			welcomeChannelSchema.deleteMany({ Guild: guildId }),
			voiceTempChannelSchema.deleteMany({ Guild: guildId }),
		])
	}
}
