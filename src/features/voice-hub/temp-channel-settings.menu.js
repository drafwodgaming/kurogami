import {
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const RENAME_COOLDOWN = 5 * 60 * 1000
const MINUTE = 60 * 1000

const MODALS = {
	channelName: ['tempChannelName', 'tempChannelNameInput'],
	channelLimit: ['tempChannelLimit', 'tempChannelLimitInput'],
}

const tempChannelSettingsMenu = {
	id: 'channelSettings',

	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const [action] = interaction.values

		const channelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!channelData) return

		const container = buildVoiceHubContainer(locale, channelData.isPersistent)

		const modalConfig = MODALS[action]

		if (modalConfig) {
			await interaction.message.edit({
				components: [container],
			})

			if (action === 'channelName') {
				const elapsed = Date.now() - (channelData.RenameTime ?? 0)

				if (elapsed < RENAME_COOLDOWN) {
					const remainingMinutes = Math.ceil((RENAME_COOLDOWN - elapsed) / MINUTE)

					return interaction.reply({
						content: locale('components.modals.channelName.messages.cooldown', {
							remainingMinutes,
						}),
						flags: MessageFlags.Ephemeral,
					})
				}
			}

			const [modalId, inputId] = modalConfig

			const input = new TextInputBuilder()
				.setCustomId(inputId)
				.setPlaceholder(locale(`components.modals.${action}.form.placeholder`))
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const label = new LabelBuilder()
				.setLabel(locale(`components.modals.${action}.form.label`))
				.setTextInputComponent(input)

			const modal = new ModalBuilder()
				.setCustomId(modalId)
				.setTitle(locale(`components.modals.${action}.title`))
				.addLabelComponents(label)

			return interaction.showModal(modal)
		}

		if (action !== 'channelPersistent') return

		if (channelData.Creator !== interaction.user.id) {
			return interaction.reply({
				content: locale('events.voiceHub.messages.persistent.error.not_creator'),
				flags: MessageFlags.Ephemeral,
			})
		}

		channelData.isPersistent = !channelData.isPersistent
		await channelData.save()

		await interaction.update({
			components: [buildVoiceHubContainer(locale, channelData.isPersistent)],
		})

		return interaction.followUp({
			content: locale(
				`events.voiceHub.messages.persistent.success.${
					channelData.isPersistent ? 'enabled' : 'disabled'
				}`
			),
			flags: MessageFlags.Ephemeral,
		})
	},
}

export default tempChannelSettingsMenu
