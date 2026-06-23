import { MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

const tempChannelLimitModal = {
	id: 'tempChannelLimit',
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const maxLimit = 99
		const minLimit = 0

		const locale = await getLocalizedText(interaction)

		const limitInput = interaction.fields.getTextInputValue('tempChannelLimitInput')
		const limit = Number.parseInt(limitInput, 10)

		if (Number.isNaN(limit) || limit < minLimit || limit > maxLimit) {
			return interaction.editReply({
				content: locale('components.modals.channelLimit.messages.invalid'),
			})
		}

		const userLimit = limit === minLimit ? maxLimit : limit

		await voiceTempChannelSchema.findOneAndUpdate(
			{ Guild: interaction.guild.id, ChannelId: interaction.channel.id },
			{ $set: { Limit: userLimit } },
			{ upsert: true }
		)

		await interaction.channel.setUserLimit(userLimit)
		await interaction.editReply(locale('components.modals.channelLimit.messages.success'))
	},
}

export default tempChannelLimitModal
