import { MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

const tempChannelNameModal = {
	id: 'tempChannelName',

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const { guild, channel, fields } = interaction

		const channelName = fields.getTextInputValue('tempChannelNameInput')
		const now = Date.now()

		await channel.setName(channelName)

		await voiceTempChannelSchema.findOneAndUpdate(
			{
				Guild: guild.id,
				ChannelId: channel.id,
			},
			{
				$set: {
					ChannelName: channelName,
					RenameTime: now,
				},
			},
			{ upsert: true }
		)

		return interaction.editReply({
			content: locale('components.modals.channelName.messages.success'),
		})
	},
}

export default tempChannelNameModal
