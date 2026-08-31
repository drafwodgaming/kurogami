import { MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

const MAX_LIMIT = 99
const UNLIMITED_LIMIT = 0

const tempChannelLimitModal = {
	id: 'tempChannelLimit',

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const limit = Number.parseInt(interaction.fields.getTextInputValue('tempChannelLimitInput'), 10)

		if (Number.isNaN(limit) || limit < UNLIMITED_LIMIT || limit > MAX_LIMIT) {
			return interaction.editReply({
				content: locale('components.modals.channelLimit.messages.invalid'),
			})
		}

		const userLimit = limit || MAX_LIMIT

		await Promise.all([
			voiceTempChannelSchema.findOneAndUpdate(
				{
					Guild: interaction.guild.id,
					ChannelId: interaction.channel.id,
				},
				{ $set: { Limit: userLimit } },
				{ upsert: true }
			),
			interaction.channel.setUserLimit(userLimit),
		])

		return interaction.editReply({
			content: locale('components.modals.channelLimit.messages.success'),
		})
	},
}

export default tempChannelLimitModal
