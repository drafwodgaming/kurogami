import { MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

const MAX_USER_LIMIT = 99
const UNLIMITED_USER_LIMIT = 0

const tempChannelLimitModal = {
	id: 'tempChannelLimit',

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const userLimit = Number.parseInt(
			interaction.fields.getTextInputValue('tempChannelLimitInput'),
			10
		)

		if (
			Number.isNaN(userLimit) ||
			userLimit < UNLIMITED_USER_LIMIT ||
			userLimit > MAX_USER_LIMIT
		) {
			return interaction.editReply({
				content: locale('components.modals.channelLimit.messages.invalid'),
			})
		}

		await Promise.all([
			voiceTempChannelSchema.findOneAndUpdate(
				{
					Guild: interaction.guild.id,
					ChannelId: interaction.channel.id,
				},
				{ $set: { Limit: userLimit } },
				{ upsert: false }
			),
			interaction.channel.setUserLimit(userLimit),
		])

		return interaction.editReply({
			content: locale('components.modals.channelLimit.messages.success'),
		})
	},
}

export default tempChannelLimitModal
