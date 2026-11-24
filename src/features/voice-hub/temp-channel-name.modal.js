import { MessageFlags } from 'discord.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const MAX_CHANNEL_NAME_LENGTH = 100

const tempChannelNameModal = {
	id: 'tempChannelName',

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const { guild, channel } = interaction
		const channelName = interaction.fields.getTextInputValue('tempChannelNameInput')
		const roomData = await voiceTempChannelSchema.findOne({
			Guild: guild.id,
			ChannelId: channel.id,
		})

		if (!roomData) {
			return interaction.editReply({
				content: locale('events.voiceHub.messages.channelNotFound'),
			})
		}

		if (!channelName.trim() || channelName.length > MAX_CHANNEL_NAME_LENGTH) {
			return interaction.editReply({
				content: locale('components.modals.channelName.messages.invalid'),
			})
		}

		const renamedAt = Date.now()
		await channel.setName(channelName)

		await voiceTempChannelSchema.findOneAndUpdate(
			{ Guild: guild.id, ChannelId: channel.id },
			{
				$set: {
					ChannelName: channelName,
					RenameTime: renamedAt,
				},
			},
			{ upsert: false }
		)

		return interaction.editReply({
			content: locale('components.modals.channelName.messages.success'),
		})
	},
}

export default tempChannelNameModal
