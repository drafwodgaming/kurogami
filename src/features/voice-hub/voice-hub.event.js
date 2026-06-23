import createVoiceChannel from '../../utils/voiceHub/create-voice-channel.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceHubCreatorSchema from '../../schemas/voice-hub.schema.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const voiceHubEvent = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(oldState, newState) {
		if (!newState.member && !oldState.member) {
			return
		}

		if (oldState.channelId === newState.channelId) {
			return
		}

		const guild = newState.guild ?? oldState.guild
		if (!guild) {
			return
		}

		const localeUser = newState.member ?? oldState.member
		const locale = await getLocalizedText(localeUser)

		const voiceHubData = await voiceHubCreatorSchema.findOne({ Guild: guild.id }).lean()
		if (!voiceHubData) {
			return
		}

		const voiceHubChannelId = voiceHubData.Channel

		if (newState.channel && newState.channel.id === voiceHubChannelId) {
			if (oldState.channel && oldState.channel.id === voiceHubChannelId) {
				return
			}

			const parentCategory = newState.channel.parentId
			const channel = await createVoiceChannel(guild, newState.member, parentCategory)

			const tempChannel = await voiceTempChannelSchema.create({
				Guild: guild.id,
				ChannelId: channel.id,
				Creator: newState.member.id,
				ChannelName: channel.name,
				Limit: channel.userLimit,
				isPersistent: false,
			})

			const container = buildVoiceHubContainer(locale, tempChannel.isPersistent)

			await channel.send({
				flags: 32_768,
				components: [container],
			})

			await newState.setChannel(channel)
		}

		if (oldState.channel) {
			const oldChannelId = oldState.channel.id
			const voiceTempChannelData = await voiceTempChannelSchema.findOne({
				ChannelId: oldChannelId,
			})
			if (!voiceTempChannelData) {
				return
			}

			const channel =
				guild.channels.cache.get(oldChannelId) ??
				(await guild.channels.fetch(oldChannelId).catch(() => null))
			if (!channel) {
				await voiceTempChannelSchema.deleteOne({ ChannelId: oldChannelId })
				return
			}

			if (channel.members.size === 0) {
				if (voiceTempChannelData.isPersistent) {
					return
				}
				await voiceTempChannelSchema.deleteOne({ ChannelId: oldChannelId })
				await channel.delete().catch(() => {})
			}
		}
	},
}

export default voiceHubEvent
