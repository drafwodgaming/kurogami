import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const tempChannelSettingsMenu = {
	id: 'channelSettings',
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const [selectedAction] = interaction.values

		const tempChannelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!tempChannelData) {
			return
		}

		switch (selectedAction) {
			case 'channelName': {
				const modal = new ModalBuilder()
					.setTitle(locale('components.modals.channelName.title'))
					.setCustomId('tempChannelName')

				const input = new TextInputBuilder()
					.setCustomId('tempChannelNameInput')
					.setPlaceholder(locale('components.modals.channelName.form.placeholder'))
					.setLabel(locale('components.modals.channelName.form.label'))
					.setStyle(TextInputStyle.Short)
					.setRequired(true)

				modal.addComponents(new ActionRowBuilder().addComponents(input))
				await interaction.showModal(modal)
				break
			}

			case 'channelLimit': {
				const modal = new ModalBuilder()
					.setTitle(locale('components.modals.channelLimit.title'))
					.setCustomId('tempChannelLimit')

				const input = new TextInputBuilder()
					.setCustomId('tempChannelLimitInput')
					.setPlaceholder(locale('components.modals.channelLimit.form.placeholder'))
					.setLabel(locale('components.modals.channelLimit.form.label'))
					.setStyle(TextInputStyle.Short)
					.setRequired(true)

				modal.addComponents(new ActionRowBuilder().addComponents(input))
				await interaction.showModal(modal)
				break
			}

			case 'channelPersistent': {
				await interaction.deferUpdate()

				if (tempChannelData.Creator !== interaction.user.id) {
					return await interaction.followUp({
						content: locale('events.voiceHub.messages.persistent.error.not_creator'),
						ephemeral: true,
					})
				}

				tempChannelData.isPersistent = !tempChannelData.isPersistent
				await tempChannelData.save()

				await interaction.followUp({
					content: locale(
						`events.voiceHub.messages.persistent.success.${tempChannelData.isPersistent ? 'enabled' : 'disabled'}`
					),
					ephemeral: true,
				})
				break
			}
		}
		const container = buildVoiceHubContainer(locale, tempChannelData.isPersistent)
		await interaction.message.edit({ components: [container] }).catch(() => {})
	},
}

export default tempChannelSettingsMenu
