import {
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import { updateVoiceHubPanel } from '../../utils/voiceHub/build-voice-hub-container.js'

const RENAME_COOLDOWN_MS = 5 * 60 * 1000
const MILLISECONDS_PER_MINUTE = 60 * 1000

const MODAL_CONFIGS = {
	channelName: {
		modalId: 'tempChannelName',
		inputId: 'tempChannelNameInput',
	},
	channelLimit: {
		modalId: 'tempChannelLimit',
		inputId: 'tempChannelLimitInput',
	},
}

const tempChannelSettingsMenu = {
	id: 'channelSettings',

	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const [action] = interaction.values
		const roomData = await voiceTempChannelSchema.findOne({
			Guild: interaction.guild.id,
			ChannelId: interaction.channelId,
		})

		if (!roomData) return

		if (roomData.Creator !== interaction.user.id) {
			return interaction.reply({
				content: locale('events.voiceHub.messages.notCreator'),
				flags: MessageFlags.Ephemeral,
			})
		}

		const modalConfig = MODAL_CONFIGS[action]
		if (!modalConfig) return interaction.deferUpdate()

		await updateVoiceHubPanel(interaction.channel, roomData, locale, interaction.message)

		if (action === 'channelName') {
			const elapsedMs = Date.now() - (roomData.RenameTime ?? 0)
			if (elapsedMs < RENAME_COOLDOWN_MS) {
				const remainingMinutes = Math.ceil(
					(RENAME_COOLDOWN_MS - elapsedMs) / MILLISECONDS_PER_MINUTE
				)

				return interaction.reply({
					content: locale('components.modals.channelName.messages.cooldown', {
						remainingMinutes,
					}),
					flags: MessageFlags.Ephemeral,
				})
			}
		}

		const input = new TextInputBuilder()
			.setCustomId(modalConfig.inputId)
			.setPlaceholder(locale(`components.modals.${action}.form.placeholder`))
			.setStyle(TextInputStyle.Short)
			.setRequired(true)

		const modal = new ModalBuilder()
			.setCustomId(modalConfig.modalId)
			.setTitle(locale(`components.modals.${action}.title`))
			.addLabelComponents(
				new LabelBuilder()
					.setLabel(locale(`components.modals.${action}.form.label`))
					.setTextInputComponent(input)
			)

		return interaction.showModal(modal)
	},
}

export default tempChannelSettingsMenu
