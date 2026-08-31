import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	ContainerBuilder,
	InteractionContextType,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'

const MAX_ROLES_PREVIEW = 15

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
		const { guild } = interaction

		if (guild.members.cache.size < guild.memberCount) {
			await guild.members.fetch()
		}

		const stats = getGuildStats(guild)

		const header = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('guildInfoHeader')
				.setLabel(guild.name)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		)

		const description = new TextDisplayBuilder().setContent(
			guild.description
				? locale('commands.guildInfo.fallbacks.description', {
						guildDescription: guild.description,
					})
				: locale('commands.guildInfo.fallbacks.noDescription')
		)

		const members = new TextDisplayBuilder().setContent(
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

		const channels = new TextDisplayBuilder().setContent(
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

		const guildEmojis = new TextDisplayBuilder().setContent(
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

		const roles = new TextDisplayBuilder().setContent(
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
			.addActionRowComponents(header)
			.addSeparatorComponents(separator)
			.addTextDisplayComponents(description, members)
			.addSeparatorComponents(separator)
			.addTextDisplayComponents(channels, guildEmojis, roles)
			.setAccentColor(getColor('bot', '0x'))

		return interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

const getGuildStats = guild => {
	const members = guild.members.cache
	const bots = members.filter(member => member.user.bot).size

	const channels = {
		total: guild.channels.cache.size,
		text: 0,
		voice: 0,
		categories: 0,
		stage: 0,
		forum: 0,
	}

	for (const channel of guild.channels.cache.values()) {
		switch (channel.type) {
			case ChannelType.GuildText:
				channels.text++
				break
			case ChannelType.GuildVoice:
				channels.voice++
				break
			case ChannelType.GuildCategory:
				channels.categories++
				break
			case ChannelType.GuildStageVoice:
				channels.stage++
				break
			case ChannelType.GuildForum:
				channels.forum++
				break
		}
	}

	const guildEmojis = guild.emojis.cache
	const animatedEmojis = guildEmojis.filter(emoji => emoji.animated).size

	const roles = guild.roles.cache
	const preview = roles
		.sorted((a, b) => b.position - a.position)
		.filter(role => role.id !== guild.id)
		.first(MAX_ROLES_PREVIEW)
		.join(', ')

	return {
		users: guild.memberCount - bots,
		bots,
		channels,
		emojis: {
			total: guildEmojis.size,
			animated: animatedEmojis,
			static: guildEmojis.size - animatedEmojis,
		},
		roles: {
			total: roles.size,
			preview,
		},
	}
}

export default guildInfoCommand
