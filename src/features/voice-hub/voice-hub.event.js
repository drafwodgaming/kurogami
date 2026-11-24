import { MessageFlags } from 'discord.js'
import voiceHubCreatorSchema from '../../schemas/voice-hub.schema.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import buildVoiceHubContainer, {
	updateVoiceHubPanel,
} from '../../utils/voiceHub/build-voice-hub-container.js'
import createVoiceChannel from '../../utils/voiceHub/create-voice-channel.js'

const voiceHubEvent = {
	name: 'voiceStateUpdate',

	async execute(oldState, newState) {
		if (!newState.member && !oldState.member) return
		if (oldState.channelId === newState.channelId) return

		const guild = newState.guild ?? oldState.guild
		const member = newState.member ?? oldState.member

		if (!guild || !member) return

		const hub = await voiceHubCreatorSchema.findOne({ Guild: guild.id }).lean()
		if (!hub) return

		if (newState.channelId === hub.Channel) {
			return createMemberRoom(guild, member, newState)
		}

		if (oldState.channelId) {
			return deleteEmptyMemberRoom(guild, oldState)
		}
	},
}

async function createMemberRoom(guild, member, newState) {
	const savedSettings = await voiceTempChannelSchema
		.findOne({ Guild: guild.id, Creator: member.id })
		.sort({ _id: -1 })
		.lean()
	const room = await createVoiceChannel(guild, member, newState.channel.parentId, savedSettings)

	try {
		const locale = await getLocalizedText(member)
		const panelMessage = await room.send({
			flags: MessageFlags.IsComponentsV2,
			components: [buildVoiceHubContainer(locale, savedSettings)],
		})

		const roomData = await voiceTempChannelSchema.findOneAndUpdate(
			savedSettings ? { _id: savedSettings._id } : { Guild: guild.id, ChannelId: room.id },
			{
				$set: {
					Guild: guild.id,
					ChannelId: room.id,
					Creator: member.id,
					ChannelName: room.name,
					Limit: room.userLimit,
					RenameTime: savedSettings?.RenameTime ?? 0,
					PanelMessageId: panelMessage.id,
				},
			},
			{ upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
		)

		await newState.setChannel(room)
		await updateVoiceHubPanel(room, roomData, locale, panelMessage).catch(() => {})
	} catch (error) {
		if (!savedSettings) {
			await voiceTempChannelSchema.deleteOne({ Guild: guild.id, ChannelId: room.id })
		}

		await room.delete().catch(() => {})
		throw error
	}
}

async function deleteEmptyMemberRoom(guild, oldState) {
	const room = oldState.channel
	if (!room) return
	if (room.members.size > 0) return

	const roomData = await voiceTempChannelSchema.findOne({
		Guild: guild.id,
		ChannelId: room.id,
	})
	if (!roomData) return

	await voiceTempChannelSchema.findOneAndUpdate(
		{ Guild: guild.id, ChannelId: room.id },
		{
			$set: {
				ChannelName: room.name,
				Limit: room.userLimit,
			},
		}
	)

	await room.delete().catch(() => {})
}

export default voiceHubEvent
