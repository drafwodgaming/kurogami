import {
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
	ActionRowBuilder,
} from 'discord.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const helpListMenu = {
	id: 'helpSelector',
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const defaultBotColor = getColor('bot', '0x')
		const [selectedAction] = interaction.values

		let infoContainer

		const backSelector = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('helpSelector')
				.setPlaceholder(locale('components.menus.help.placeholder'))
				.setOptions([
					{
						label: locale('components.menus.help.options.commands.label'),
						description: locale('components.menus.help.options.commands.description'),
						value: 'commands',
						emoji: emojis.commands,
					},
				])
		)

		switch (selectedAction) {
			case 'commands': {
				const title = new TextDisplayBuilder().setContent(
					locale('commands.help.sections.commandsSection.title')
				)

				const description = new TextDisplayBuilder().setContent(
					locale('commands.help.sections.commandsSection.description')
				)

				const commandsList = new TextDisplayBuilder().setContent(
					[
						`**\`/guild info\`** - ${locale('commands.help.sections.commandsSection.list.guildInfo')}`,
						`**\`/channels setup\`** - ${locale('commands.help.sections.commandsSection.list.channelsSetup')}`,
						`**\`/locale set\`** - ${locale('commands.help.sections.commandsSection.list.localeSet')}`,
					].join('\n')
				)

				const buttonsRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel(locale('components.buttons.help.invite.label'))
						.setStyle(ButtonStyle.Link)
						.setEmoji(emojis.invite)
						.setURL(
							interaction.client.generateInvite({
								scopes: ['bot', 'applications.commands'],
								permissions: BigInt('70368744177663'),
							})
						),
					new ButtonBuilder()
						.setLabel(locale('components.buttons.help.support.label'))
						.setStyle(ButtonStyle.Link)
						.setEmoji(emojis.supportServer)
						.setURL('https://discord.gg/8WqMqCqt8e')
				)

				const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)

				infoContainer = new ContainerBuilder()
					.addTextDisplayComponents(title, description)
					.addSeparatorComponents(separator)
					.addTextDisplayComponents(commandsList)
					.addSeparatorComponents(separator)
					.addActionRowComponents(backSelector, buttonsRow)
					.setAccentColor(defaultBotColor)

				break
			}
		}

		await interaction.update({
			flags: MessageFlags.IsComponentsV2,
			components: [infoContainer],
		})
	},
}

export default helpListMenu
