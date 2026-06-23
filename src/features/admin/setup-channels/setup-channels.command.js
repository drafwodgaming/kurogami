import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	InteractionContextType,
	LabelBuilder,
	ModalBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js'
import getLocalizedText from '../../../utils/general/get-locale.js'

const channelSetupFields = [
	{
		id: 'chooseLeaveChannel',
		label: 'components.modals.channelSetup.form.leaveChannel.label',
		description: 'components.modals.channelSetup.form.leaveChannel.description',
		placeholder: 'components.modals.channelSetup.form.leaveChannel.placeholder',
		channelType: ChannelType.GuildText,
	},
	{
		id: 'chooseVoiceHubChannel',
		label: 'components.modals.channelSetup.form.voiceHub.label',
		description: 'components.modals.channelSetup.form.voiceHub.description',
		placeholder: 'components.modals.channelSetup.form.voiceHub.placeholder',
		channelType: ChannelType.GuildVoice,
	},
	{
		id: 'chooseWelcomeChannel',
		label: 'components.modals.channelSetup.form.welcomeChannel.label',
		description: 'components.modals.channelSetup.form.welcomeChannel.description',
		placeholder: 'components.modals.channelSetup.form.welcomeChannel.placeholder',
		channelType: ChannelType.GuildText,
	},
]

const setupChannelsCommand = {
	data: new SlashCommandBuilder()
		.setName('channels')
		.setDescription('Setup channels for the bot')
		.setDescriptionLocalizations({
			ru: 'Настроить каналы для бота',
			uk: 'Налаштувати канали для бота',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('setup')
				.setDescription('Setup channels for the bot')
				.setDescriptionLocalizations({
					ru: 'Настроить каналы для бота',
					uk: 'Налаштувати канали для бота',
				})
		)
		.setContexts(InteractionContextType.Guild),

	async actions(interaction) {
		const locale = await getLocalizedText(interaction)

		const components = channelSetupFields.map(
			({ id, label, description, placeholder, channelType }) => {
				const channelSelector = new ActionRowBuilder().addComponents(
					new ChannelSelectMenuBuilder()
						.setCustomId(id)
						.setPlaceholder(locale(placeholder))
						.setChannelTypes(channelType)
						.setMinValues(1)
						.setMaxValues(1)
						.setDisabled(false)
						.setRequired(false)
				).components[0]

				return new LabelBuilder()
					.setLabel(locale(label))
					.setDescription(locale(description))
					.setChannelSelectMenuComponent(channelSelector)
			}
		)

		const modal = new ModalBuilder()
			.setCustomId('setupChannelsModal')
			.setTitle(locale('components.modals.channelSetup.title'))
			.addLabelComponents(...components)

		return interaction.showModal(modal)
	},
}

export default setupChannelsCommand
