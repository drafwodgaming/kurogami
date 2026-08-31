import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	UserSelectMenuBuilder,
} from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

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
		const [type] = interaction.values

		const channelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!channelData) return

		const container = buildVoiceHubContainer(locale, channelData.isPersistent)

		const modalConfig = MODAL_CONFIGS[type]

		if (modalConfig) {
			const { modalId, inputId } = modalConfig

			const input = new TextInputBuilder()
				.setCustomId(inputId)
				.setPlaceholder(locale(`components.modals.${type}.form.placeholder`))
				.setLabel(locale(`components.modals.${type}.form.label`))
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

			const modal = new ModalBuilder()
				.setCustomId(modalId)
				.setTitle(locale(`components.modals.${type}.title`))
				.addComponents(new ActionRowBuilder().addComponents(input))

			await interaction.showModal(modal)

			return interaction.message.edit({
				components: [container],
			})
		}

		if (type === 'channelInvite') {
			const userSelector = new UserSelectMenuBuilder()
				.setCustomId('inviteUser')
				.setPlaceholder(locale('components.menus.voiceHub.channelInvite.placeholder'))

			await interaction.update({
				components: [new ActionRowBuilder().addComponents(userSelector)],
			})

			return
		}

		if (type === 'channelPersistent') {
			await interaction.deferUpdate()

			if (channelData.Creator !== interaction.user.id) {
				return interaction.followUp({
					content: locale('events.voiceHub.messages.persistent.error.not_creator'),
					ephemeral: true,
				})
			}

			channelData.isPersistent = !channelData.isPersistent
			await channelData.save()

			await interaction.followUp({
				content: locale(
					`events.voiceHub.messages.persistent.success.${
						channelData.isPersistent ? 'enabled' : 'disabled'
					}`
				),
				ephemeral: true,
			})

			return interaction.message.edit({
				components: [buildVoiceHubContainer(locale, channelData.isPersistent)],
			})
		}

		return interaction.update({
			components: [container],
		})
	},
}

export default tempChannelSettingsMenu
