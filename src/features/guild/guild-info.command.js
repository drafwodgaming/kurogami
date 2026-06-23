import {
	ChannelType,
	InteractionContextType,
	MessageFlags,
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	ContainerBuilder,
} from 'discord.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const guildInfoCommand = {
	data: new SlashCommandBuilder()
		.setName('guild')
		.setDescription('View information about the server')
		.setDescriptionLocalizations({
			ru: 'Показать общую информацию о сервере',
			uk: 'Показати загальну інформацію про сервер',
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('View information about the server')
				.setDescriptionLocalizations({
					ru: 'Показать общую информацию о сервере',
					uk: 'Показати загальну інформацію про сервер',
				})
		)
		.setContexts(InteractionContextType.Guild),

	async actions(interaction) {
		await interaction.deferReply()

		const locale = await getLocalizedText(interaction)
		const defaultBotColor = getColor('bot', '0x')
		const { guild } = interaction

		await guild.members.fetch()

		const stats = getGuildStats(guild)

		const headerBuilder = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('guildInfoHeader')
				.setLabel(guild.name)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		)

		const hasDescription = Boolean(guild.description)
		const description = new TextDisplayBuilder().setContent(
			hasDescription
				? locale('commands.guildInfo.fallbacks.description', {
						guildDescription: guild.description,
					})
				: locale('commands.guildInfo.fallbacks.noDescription')
		)

		const membersBuilder = new TextDisplayBuilder().setContent(
			[
				locale('commands.guildInfo.members.title', {
					totalMembersCount: guild.memberCount,
				}),
				locale('commands.guildInfo.members.breakdown.users', {
					nonBotMembersCount: stats.users,
				}),
				locale('commands.guildInfo.members.breakdown.bots', {
					botMembersCount: stats.bots,
				}),
			].join('\n')
		)

		const channelsBuilder = new TextDisplayBuilder().setContent(
			[
				locale('commands.guildInfo.channels.title', {
					totalChannels: stats.channels.total,
				}),
				locale('commands.guildInfo.channels.text.title', {
					textChannelsIco: emojis.textChannel,
					textChannels: stats.channels.text,
				}),
				locale('commands.guildInfo.channels.voice.title', {
					voiceChannelsIco: emojis.voiceChannel,
					voiceChannels: stats.channels.voice,
				}),
				locale('commands.guildInfo.channels.category.title', {
					categoryChannelsIco: emojis.category,
					categoryChannels: stats.channels.categories,
				}),
				locale('commands.guildInfo.channels.stage.title', {
					stageChannelsIco: emojis.stage,
					stageChannels: stats.channels.stage,
				}),
				locale('commands.guildInfo.channels.forum.title', {
					forumChannelsIco: emojis.forum,
					forumChannels: stats.channels.forum,
				}),
			].join('\n')
		)

		const emojisBuilder = new TextDisplayBuilder().setContent(
			[
				locale('commands.guildInfo.emojis.title', {
					totalEmojisCount: stats.emojis.total,
				}),
				locale('commands.guildInfo.emojis.breakdown.static', {
					staticEmojisCount: stats.emojis.static,
				}),
				locale('commands.guildInfo.emojis.breakdown.animated', {
					animatedEmojisCount: stats.emojis.animated,
				}),
			].join('\n')
		)

		const rolesBuilder = new TextDisplayBuilder().setContent(
			[
				locale('commands.guildInfo.roles.title', {
					totalRolesCount: stats.roles.total,
				}),
				locale('commands.guildInfo.roles.preview', {
					rolesPreview: stats.roles.preview,
				}),
			].join('\n')
		)

		const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)

		const container = new ContainerBuilder()
			.addActionRowComponents(headerBuilder)
			.addSeparatorComponents(separator)
			.addTextDisplayComponents(description, membersBuilder)
			.addSeparatorComponents(separator)
			.addTextDisplayComponents(channelsBuilder, emojisBuilder, rolesBuilder)
			.setAccentColor(defaultBotColor)

		await interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

function getGuildStats(guild) {
	const users = guild.members.cache.filter(member => !member.user.bot).size
	const bots = guild.memberCount - users

	const channels = {
		text: 0,
		voice: 0,
		categories: 0,
		stage: 0,
		forum: 0,
	}

	for (const channel of guild.channels.cache.values()) {
		switch (channel.type) {
			case ChannelType.GuildText:
				channels.text += 1
				break
			case ChannelType.GuildVoice:
				channels.voice += 1
				break
			case ChannelType.GuildCategory:
				channels.categories += 1
				break
			case ChannelType.GuildStageVoice:
				channels.stage += 1
				break
			case ChannelType.GuildForum:
				channels.forum += 1
				break
		}
	}
	channels.total = guild.channels.cache.size

	const guildEmojis = {
		total: guild.emojis.cache.size,
		animated: guild.emojis.cache.filter(e => e.animated).size,
	}

	guildEmojis.static = guildEmojis.total - guildEmojis.animated

	const maxRolesPreview = 15

	const allRoles = guild.roles.cache
	const preview = allRoles
		.sorted((roleA, roleB) => roleB.position - roleA.position)
		.filter(role => role.id !== guild.id)
		.first(maxRolesPreview)
		.join(', ')

	return {
		users,
		bots,
		channels,
		emojis: guildEmojis,
		roles: {
			total: allRoles.size,
			preview,
		},
	}
}

export default guildInfoCommand
