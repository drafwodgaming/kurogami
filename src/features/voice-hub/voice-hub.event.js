import { MessageFlags } from 'discord.js'
import createVoiceChannel from '../../utils/voiceHub/create-voice-channel.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceHubCreatorSchema from '../../schemas/voice-hub.schema.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const voiceHubEvent = {
	name: 'voiceStateUpdate',

	async execute(oldState, newState) {
		if (!newState.member && !oldState.member) return
		if (oldState.channelId === newState.channelId) return

		const guild = newState.guild ?? oldState.guild
		const member = newState.member ?? oldState.member

		if (!guild || !member) return

		const voiceHubData = await voiceHubCreatorSchema.findOne({ Guild: guild.id }).lean()

		if (!voiceHubData) return

		if (newState.channelId === voiceHubData.Channel) {
			const channel = await createVoiceChannel(guild, member, newState.channel.parentId)

			await newState.setChannel(channel)

			const [locale, tempChannel] = await Promise.all([
				getLocalizedText(member),
				voiceTempChannelSchema.create({
					Guild: guild.id,
					ChannelId: channel.id,
					Creator: member.id,
					ChannelName: channel.name,
					Limit: channel.userLimit,
					isPersistent: false,
				}),
			])

			await channel.send({
				flags: MessageFlags.IsComponentsV2,
				components: [buildVoiceHubContainer(locale, tempChannel.isPersistent)],
			})

			return
		}

		if (!oldState.channelId) return

		const tempChannelData = await voiceTempChannelSchema.findOne({
			Guild: guild.id,
			ChannelId: oldState.channelId,
		})

		if (!tempChannelData) return
		if (oldState.channel.members.size > 0) return
		if (tempChannelData.isPersistent) return

		await voiceTempChannelSchema.deleteOne({
			Guild: guild.id,
			ChannelId: oldState.channelId,
		})

		await oldState.channel.delete().catch(() => {})
	},
}

export default voiceHubEvent
