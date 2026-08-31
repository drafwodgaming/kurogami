import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js'
import getColor from '../../../utils/general/get-color.js'
import getLocalizedText from '../../../utils/general/get-locale.js'
import leaveChannelSchema from '../../../schemas/leave-channel.schema.js'
import voiceHubCreatorSchema from '../../../schemas/voice-hub.schema.js'
import welcomeChannelSchema from '../../../schemas/welcome-channel.schema.js'

const CHANNEL_SETUP_CONFIGS = [
	{
		type: 'leaveChannel',
		fieldId: 'chooseLeaveChannel',
		schema: leaveChannelSchema,
	},
	{
		type: 'voiceHub',
		fieldId: 'chooseVoiceHubChannel',
		schema: voiceHubCreatorSchema,
	},
	{
		type: 'welcomeChannel',
		fieldId: 'chooseWelcomeChannel',
		schema: welcomeChannelSchema,
	},
]

const setupChannelsModal = {
	id: 'setupChannelsModal',

	async execute(interaction) {
		await interaction.deferReply()

		const locale = await getLocalizedText(interaction)
		const { guild, fields } = interaction

		const results = (
			await Promise.all(
				CHANNEL_SETUP_CONFIGS.map(async ({ type, fieldId, schema }) => {
					const channel = fields.getSelectedChannels(fieldId)?.first()

					if (!channel) return null

					const currentConfig = await schema.findOne({
						Guild: guild.id,
					})

					if (currentConfig?.Channel === channel.id) {
						return {
							status: 'alreadySet',
							message: locale(`components.modals.channelSetup.form.${type}.messages.alreadySet`, {
								channelId: channel.id,
							}),
						}
					}

					await schema.findOneAndUpdate(
						{ Guild: guild.id },
						{ $set: { Channel: channel.id } },
						{ upsert: true }
					)

					return {
						status: 'success',
						message: locale(`components.modals.channelSetup.form.${type}.messages.success`, {
							channelId: channel.id,
						}),
					}
				})
			)
		).filter(Boolean)

		if (!results.length) {
			return interaction.editReply({
				content: locale('components.modals.channelSetup.response.noChanges'),
			})
		}

		const title = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('setupChannelsResponseTitle')
				.setLabel(locale('components.modals.channelSetup.response.title'))
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		)

		const description = new TextDisplayBuilder().setContent(
			locale('components.modals.channelSetup.response.description')
		)

		const resultComponents = results.map(({ status, message }) =>
			new TextDisplayBuilder().setContent(`${status === 'success' ? '✅' : 'ℹ️'} ${message}`)
		)

		const hasChanges = results.some(({ status }) => status === 'success')

		const container = new ContainerBuilder()
			.addActionRowComponents(title)
			.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
			.addTextDisplayComponents(description, ...resultComponents)
			.setAccentColor(getColor(hasChanges ? 'success' : 'warning', '0x'))

		return interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

export default setupChannelsModal
