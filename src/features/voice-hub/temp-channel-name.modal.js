import { getLocalizedText } from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

export default class TempChannelName {
	id = 'tempChannelName'
	async execute(interaction) {
		await interaction.deferReply({ flags: 64 })

		const locale = await getLocalizedText(interaction)

		const channelName = interaction.fields.getTextInputValue('tempChannelNameInput')

		const currentTime = Date.now()
		const fiveMinutes = 300_000
		const oneMinute = 60_000

		const existingChannel = await voiceTempChannelSchema.findOne({
			Guild: interaction.guild.id,
			ChannelId: interaction.channel.id,
		})

		if (existingChannel) {
			if (currentTime - existingChannel.RenameTime < fiveMinutes) {
				const remainingTime = fiveMinutes - (currentTime - existingChannel.RenameTime)
				const remainingMinutes = Math.ceil(remainingTime / oneMinute)

				return interaction.editReply(
					locale('components.modals.channelName.messages.cooldown', {
						remainingMinutes,
					})
				)
			}
		}

		await voiceTempChannelSchema.findOneAndUpdate(
			{ Guild: interaction.guild.id, ChannelId: interaction.channel.id },
			{ $set: { ChannelName: channelName, RenameTime: currentTime } },
			{ upsert: true }
		)

		await interaction.channel.setName(channelName)
		await interaction.editReply(locale('components.modals.channelName.messages.success'))
	}
}
