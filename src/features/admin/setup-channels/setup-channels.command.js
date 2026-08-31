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

const CHANNEL_SETUP_FIELDS = [
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

const createChannelField = ({ id, label, description, placeholder, channelType }, locale) => {
	const select = new ChannelSelectMenuBuilder()
		.setCustomId(id)
		.setPlaceholder(locale(placeholder))
		.setChannelTypes(channelType)
		.setMinValues(1)
		.setMaxValues(1)
		.setRequired(false)

	return new LabelBuilder()
		.setLabel(locale(label))
		.setDescription(locale(description))
		.setChannelSelectMenuComponent(new ActionRowBuilder().addComponents(select).components[0])
}

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

		const fields = CHANNEL_SETUP_FIELDS.map(field => createChannelField(field, locale))

		const modal = new ModalBuilder()
			.setCustomId('setupChannelsModal')
			.setTitle(locale('components.modals.channelSetup.title'))
			.addLabelComponents(...fields)

		return interaction.showModal(modal)
	},
}

export default setupChannelsCommand
