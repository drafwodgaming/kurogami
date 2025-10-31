import { ContainerBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { buildStringSelector } from '../../utils/builders/string-selector.builder.js'
import { buildTextComponent } from '../../utils/builders/text-component.builder.js'
import { buildSeparatorComponent } from '../../utils/builders/separator-component.builder.js'
import { buildButtonComponent } from '../../utils/builders/button-component.builder.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../../utils/general/get-color.js'
import { getLocalizedText } from '../../utils/general/get-locale.js'

export default class Help {
	data = new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get bot help and information')
		.setDescriptionLocalizations({
			ru: 'Получить помощь и информацию о боте',
			uk: 'Отримати довідку та інформацію про бота',
		})
		.setContexts('Guild', 'BotDM')

	async actions(interaction) {
		await interaction.deferReply()
		const locale = await getLocalizedText(interaction)
		const defaultBotColor = getColor('bot', '0x')

		const title = buildTextComponent(locale('commands.help.title', { helpEmoji: emojis.helpMenu }))
		const description = buildTextComponent(locale('commands.help.description'))

		const { guilds } = interaction.client
		const serversCount = guilds.cache.size
		const usersCount = [...guilds.cache.values()]
			.reduce((acc, { memberCount }) => acc + memberCount, 0)
			.toLocaleString()

		const stats = buildTextComponent(locale('commands.help.stats', { serversCount, usersCount }))

		const helpSelector = buildStringSelector({
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

		const container = new ContainerBuilder({
			components: [
				title,
				description,
				stats,
				buildSeparatorComponent({ size: 'small' }),
				helpSelector,
				buttonsRow,
			],
			accent_color: defaultBotColor,
		})

		await interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	}
}
