import {
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js'
import { buildButtonComponent } from '../../../utils/builders/button-component.builder.js'
import { buildChannelSelector } from '../../../utils/builders/channel-selector.builder.js'
import { buildContainerComponent } from '../../../utils/builders/container-component.builder.js'
import { buildSeparatorComponent } from '../../../utils/builders/separator-component.builder.js'
import { buildTextComponent } from '../../../utils/builders/text-component.builder.js'
import emojis from '../../../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../../../utils/general/get-color.js'
import { getLocalizedText } from '../../../utils/general/get-locale.js'

export default class SetupChannels {
	data = new SlashCommandBuilder()
		.setName('channels')
		.setDescription('Select channels')
		.setDescriptionLocalizations({
			ru: 'Настройка каналов',
			uk: 'Налаштування каналів',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand.setName('setup').setDescription('Setup channels').setDescriptionLocalizations({
				ru: 'Настройка каналов',
				uk: 'Налаштування каналів',
			})
		)
		.setContexts(InteractionContextType.Guild)

	async actions(interaction) {
		await interaction.deferReply()

		const locale = await getLocalizedText(interaction)
		const color = getColor('bot', '0x')

		const header = buildButtonComponent({
			id: 'channelsSettingsHeader',
			label: locale('components.setupChannels.title'),
			emoji: emojis.serverSettings,
			style: 'secondary',
			disabled: true,
		})

		const separator = buildSeparatorComponent({ size: 'large' })

		const description = buildTextComponent(
			`> ${locale('components.menus.channelSetup.description')}`
		)

		const welcomeSelector = buildChannelSelector({
			id: 'chooseWelcomeChannel',
			placeholder: locale('components.menus.channelSetup.welcome.placeholder'),
			channelType: ['text'],
		})

		const leaveSelector = buildChannelSelector({
			id: 'chooseLeaveChannel',
			placeholder: locale('components.menus.channelSetup.leave.placeholder'),
			channelType: ['text'],
		})

		const voiceHubSelector = buildChannelSelector({
			id: 'chooseVoiceHubChannel',
			placeholder: locale('components.menus.channelSetup.voiceHub.placeholder'),
			channelType: ['voice'],
		})

		const container = buildContainerComponent({
			components: [
				header,
				separator,
				description,
				welcomeSelector,
				leaveSelector,
				voiceHubSelector,
			],
			accentColor: color,
		})

		await interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	}
}
