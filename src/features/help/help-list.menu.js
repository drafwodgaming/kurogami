import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const INVITE_PERMISSIONS = BigInt('70368744177663')

const HELP_DESCRIPTIONS = {
	'guild info': 'commands.help.sections.commandsSection.list.guildInfo',
	'channels setup': 'commands.help.sections.commandsSection.list.channelsSetup',
	'locale setup': 'commands.help.sections.commandsSection.list.localeSet',
}

const helpListMenu = {
	id: 'helpSelector',

	async execute(interaction, { commands }) {
		const locale = await getLocalizedText(interaction)
		const [selectedAction] = interaction.values

		if (selectedAction !== 'commands') return

		const commandsList = [...commands.values()]
			.flatMap(command => {
				const data = command.data?.toJSON()

				if (!data) return []

				const subcommands = data.options?.filter(option => option.type === 1)

				if (!subcommands?.length) {
					return [{ name: data.name }]
				}

				return subcommands.map(subcommand => ({
					name: `${data.name} ${subcommand.name}`,
				}))
			})
			.filter(({ name }) => HELP_DESCRIPTIONS[name])
			.map(({ name }) => `**\`/${name}\`** - ${locale(HELP_DESCRIPTIONS[name])}`)
			.join('\n')

		const selector = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('helpSelector')
				.setPlaceholder(locale('components.menus.help.placeholder'))
				.addOptions({
					label: locale('components.menus.help.options.commands.label'),
					description: locale('components.menus.help.options.commands.description'),
					value: 'commands',
					emoji: emojis.commands,
				})
		)

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel(locale('components.buttons.help.invite.label'))
				.setStyle(ButtonStyle.Link)
				.setEmoji(emojis.invite)
				.setURL(
					interaction.client.generateInvite({
						scopes: ['bot', 'applications.commands'],
						permissions: INVITE_PERMISSIONS,
					})
				),
			new ButtonBuilder()
				.setLabel(locale('components.buttons.help.support.label'))
				.setStyle(ButtonStyle.Link)
				.setEmoji(emojis.supportServer)
				.setURL('https://discord.gg/8WqMqCqt8e')
		)

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(locale('commands.help.sections.commandsSection.title')),
				new TextDisplayBuilder().setContent(
					locale('commands.help.sections.commandsSection.description')
				),
				new TextDisplayBuilder().setContent(commandsList)
			)
			.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
			.addActionRowComponents(selector, buttons)
			.setAccentColor(getColor('bot', '0x'))

		return interaction.update({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

export default helpListMenu
