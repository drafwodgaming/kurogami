import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	InteractionContextType,
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

const INVITE_PERMISSIONS = BigInt('70368744177663')

const helpCommand = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get bot help and information')
		.setDescriptionLocalizations({
			ru: 'Получить помощь и информацию о боте',
			uk: 'Отримати довідку та інформацію про бота',
		})
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),

	async actions(interaction) {
		await interaction.deferReply()

		const locale = await getLocalizedText(interaction)
		const { client } = interaction
		const { guilds } = client

		const serversCount = guilds.cache.size
		const usersCount = guilds.cache
			.reduce((total, guild) => total + guild.memberCount, 0)
			.toLocaleString()

		const title = new TextDisplayBuilder().setContent(locale('commands.help.title'))

		const description = new TextDisplayBuilder().setContent(locale('commands.help.description'))

		const stats = new TextDisplayBuilder().setContent(
			locale('commands.help.stats', {
				serversCount,
				usersCount,
			})
		)

		const helpSelector = new ActionRowBuilder().addComponents(
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
					client.generateInvite({
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
			.addTextDisplayComponents(title, description, stats)
			.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
			.addActionRowComponents(helpSelector, buttons)
			.setAccentColor(getColor('bot', '0x'))

		return interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

export default helpCommand
