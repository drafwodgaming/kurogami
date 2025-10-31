import { ContainerBuilder, MessageFlags } from 'discord.js'
import { buildStringSelector } from '../../utils/builders/string-selector.builder.js'
import { buildTextComponent } from '../../utils/builders/text-component.builder.js'
import { buildSeparatorComponent } from '../../utils/builders/separator-component.builder.js'
import { buildButtonComponent } from '../../utils/builders/button-component.builder.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../../utils/general/get-color.js'
import { getLocalizedText } from '../../utils/general/get-locale.js'

export default class HelpMenu {
	id = 'helpSelector'
	// TODO: Доделать help menu selector
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const defaultBotColor = getColor('bot', '0x')
		const [selectedAction] = interaction.values

		let infoContainer

		const backSelector = buildStringSelector({
			id: 'helpSelector',
			placeholder: locale('components.menus.help.placeholder'),
			options: [
				{
					label: locale('components.menus.help.options.commands.label'),
					description: locale('components.menus.help.options.commands.description'),
					value: 'commands',
					emoji: emojis.commands,
				},
			],
		})

		switch (selectedAction) {
			case 'commands': {
				const title = buildTextComponent(locale('commands.help.sections.commandsSection.title'))

				const description = buildTextComponent(
					locale('commands.help.sections.commandsSection.description')
				)

				const commandsList = buildTextComponent(
					[
						`**\`/guild info\`** - ${locale('commands.help.sections.commandsSection.list.guildInfo')}`,
						`**\`/channels setup\`** - ${locale('commands.help.sections.commandsSection.list.channelsSetup')}`,
						`**\`/locale set\`** - ${locale('commands.help.sections.commandsSection.list.localeSet')}`,
					].join('\n')
				)

				const buttonsRow = buildButtonComponent([
					{
						label: locale('components.buttons.help.invite.label'),
						style: 'link',
						emoji: emojis.invite,
						url: interaction.client.generateInvite({
							scopes: ['bot', 'applications.commands'],
							permissions: BigInt('70368744177663'),
						}),
					},
					{
						label: locale('components.buttons.help.support.label'),
						style: 'link',
						emoji: emojis.supportServer,
						url: 'https://discord.com/invite/gQxDrqj9xk',
					},
				])

				infoContainer = new ContainerBuilder({
					components: [
						title,
						description,
						buildSeparatorComponent({ size: 'small' }),
						commandsList,
						buildSeparatorComponent({ size: 'small' }),
						backSelector,
						buttonsRow,
					],
				}).setAccentColor(defaultBotColor)
				break
			}
		}

		await interaction.update({
			flags: MessageFlags.IsComponentsV2,
			components: [infoContainer],
		})
	}
}
