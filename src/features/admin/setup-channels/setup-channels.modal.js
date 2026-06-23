import {
	MessageFlags,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ContainerBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js'
import getColor from '../../../utils/general/get-color.js'
import getLocalizedText from '../../../utils/general/get-locale.js'
import leaveChannelSchema from '../../../schemas/leave-channel.schema.js'
import voiceHubCreatorSchema from '../../../schemas/voice-hub.schema.js'
import welcomeChannelSchema from '../../../schemas/welcome-channel.schema.js'

const channelSetupConfigs = [
	{ type: 'leaveChannel', fieldId: 'chooseLeaveChannel', schema: leaveChannelSchema },
	{ type: 'voiceHub', fieldId: 'chooseVoiceHubChannel', schema: voiceHubCreatorSchema },
	{ type: 'welcomeChannel', fieldId: 'chooseWelcomeChannel', schema: welcomeChannelSchema },
]

const setupChannelsModal = {
	id: 'setupChannelsModal',
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const successColor = getColor('success', '0x')
		const warningColor = getColor('warning', '0x')
		const { guild, fields } = interaction

		const results = []
		let hasSuccessfulChanges = false

		for (const { type, fieldId, schema } of channelSetupConfigs) {
			const selectedChannel = fields.getSelectedChannels(fieldId)?.first()
			if (!selectedChannel) continue

			const newChannelId = selectedChannel.id
			const currentConfig = await schema.findOne({ Guild: guild.id })
			const status = currentConfig?.Channel === newChannelId ? 'alreadySet' : 'success'

			await schema.findOneAndUpdate(
				{ Guild: guild.id },
				{ $set: { Channel: newChannelId } },
				{ upsert: true, returnDocument: 'after' }
			)

			if (status === 'success') hasSuccessfulChanges = true

			results.push({
				status,
				message: locale(`components.modals.channelSetup.form.${type}.messages.${status}`, {
					channelId: newChannelId,
				}),
			})
		}

		if (results.length === 0) return

		const title = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('setupChannelsResponseTitle')
				.setLabel(locale('components.modals.channelSetup.response.title'))
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		)

		const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
		const description = new TextDisplayBuilder().setContent(
			locale('components.modals.channelSetup.response.description')
		)
		const resultComponents = results.map(({ status, message }) =>
			new TextDisplayBuilder().setContent(`${status === 'success' ? '✅' : 'ℹ️'} ${message}`)
		)

		const containter = new ContainerBuilder()
			.addActionRowComponents(title)
			.addSeparatorComponents(separator)
			.addTextDisplayComponents(description, ...resultComponents)
			.setAccentColor(hasSuccessfulChanges ? successColor : warningColor)

		return interaction.reply({
			flags: MessageFlags.IsComponentsV2,
			components: [containter],
		})
	},
}

export default setupChannelsModal
