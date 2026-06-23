import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const helpCommand = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get bot help and information')
		.setDescriptionLocalizations({
			ru: 'Получить помощь и информацию о боте',
			uk: 'Отримати довідку та інформацію про бота',
		})
		.setContexts('Guild', 'BotDM'),
	async actions(interaction) {
		await interaction.deferReply()
		const locale = await getLocalizedText(interaction)
		const defaultBotColor = getColor('bot', '0x')

		const title = new TextDisplayBuilder().setContent(locale('commands.help.title'))
		const description = new TextDisplayBuilder().setContent(locale('commands.help.description'))

		const { guilds } = interaction.client
		const serversCount = guilds.cache.size
		const usersCount = [...guilds.cache.values()]
			.reduce((acc, { memberCount }) => acc + memberCount, 0)
			.toLocaleString()

		const stats = new TextDisplayBuilder().setContent(
			locale('commands.help.stats', { serversCount, usersCount })
		)

		const helpSelector = new ActionRowBuilder().addComponents(
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

		const container = new ContainerBuilder()
			.addTextDisplayComponents(title, description, stats)
			.addSeparatorComponents(separator)
			.addActionRowComponents(helpSelector, buttonsRow)
			.setAccentColor(defaultBotColor)

		await interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

export default helpCommand
