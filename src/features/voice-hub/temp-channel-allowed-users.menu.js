import {
	ActionRowBuilder,
	EmbedBuilder,
	MessageFlags,
	StringSelectMenuBuilder,
} from 'discord.js'
import getColor from '../../utils/general/get-color.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import { updateVoiceHubPanel } from '../../utils/voiceHub/build-voice-hub-container.js'

const MAX_OPTIONS = 25
const PAGED_OPTIONS = 23
const NEXT_PAGE = '__next_page__'
const PREVIOUS_PAGE = '__previous_page__'

export const buildAllowedUsersView = async (guild, allowedUsers, locale, page = 0) => {
	const userIds = allowedUsers ?? []
	const pageSize = userIds.length > MAX_OPTIONS ? PAGED_OPTIONS : MAX_OPTIONS
	const pageCount = Math.max(1, Math.ceil(userIds.length / pageSize))
	const currentPage = Math.min(Math.max(page, 0), pageCount - 1)
	const pageUsers = userIds.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
	const description = pageUsers.length
		? pageUsers.map(userId => `• <@${userId}>`).join('\n')
		: locale('components.menus.voiceHub.channelPermissions.options.allowedUsers.empty')

	const embed = new EmbedBuilder()
		.setColor(getColor('bot', '0x'))
		.setTitle(
			locale('components.menus.voiceHub.channelPermissions.options.allowedUsers.title', {
				count: userIds.length,
			})
		)
		.setDescription(description)
		.setFooter({
			text: locale('components.menus.voiceHub.channelPermissions.options.allowedUsers.page', {
				page: currentPage + 1,
				pages: pageCount,
			}),
		})

	const components = []
	if (pageUsers.length > 0) {
		const options = await Promise.all(
			pageUsers.map(userId => buildAllowedUserOption(guild, userId, locale))
		)

		if (currentPage > 0) {
			options.push({
				label: locale(
					'components.menus.voiceHub.channelPermissions.options.allowedUsers.previousPage'
				),
				value: PREVIOUS_PAGE,
			})
		}
		if (currentPage < pageCount - 1) {
			options.push({
				label: locale(
					'components.menus.voiceHub.channelPermissions.options.allowedUsers.nextPage'
				),
				value: NEXT_PAGE,
			})
		}

		components.push(
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('removeAllowedUser')
					.setPlaceholder(
						locale(
							'components.menus.voiceHub.channelPermissions.options.allowedUsers.selectPlaceholder'
						)
					)
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions(options)
			)
		)
	}

	return { embeds: [embed], components }
}

async function buildAllowedUserOption(guild, userId, locale) {
	const cachedMember = guild.members.cache.get(userId)
	const member = cachedMember ?? (await guild.members.fetch(userId).catch(() => null))
	const user = member?.user ?? guild.client.users.cache.get(userId)
	const displayName =
		member?.displayName ?? user?.globalName ?? user?.username ?? `User …${userId.slice(-4)}`

	return {
		label: displayName.slice(0, 100),
		description: locale(
			'components.menus.voiceHub.channelPermissions.options.allowedUsers.removeOptionDescription'
		),
		value: userId,
	}
}

const tempChannelAllowedUsersMenu = {
	id: 'removeAllowedUser',

	async execute(interaction) {
		await interaction.deferUpdate()

		const locale = await getLocalizedText(interaction)
		const [selection] = interaction.values
		const channelData = await voiceTempChannelSchema.findOne({
			Guild: interaction.guild.id,
			ChannelId: interaction.channelId,
		})

		if (!channelData) {
			return interaction.editReply({
				content: locale('events.voiceHub.messages.channelNotFound'),
				components: [],
			})
		}

		if (channelData.Creator !== interaction.user.id) {
			return interaction.editReply({
				content: locale('events.voiceHub.messages.notCreator'),
				components: [],
			})
		}

		const currentPage = getCurrentPage(interaction.message)

		if (selection === NEXT_PAGE || selection === PREVIOUS_PAGE) {
			const direction = selection === NEXT_PAGE ? 1 : -1
			const view = await buildAllowedUsersView(
				interaction.guild,
				channelData.AllowedUsers ?? [],
				locale,
				currentPage + direction
			)

			return interaction.editReply({
				content: null,
				embeds: view.embeds,
				components: view.components,
			})
		}

		const selectedUserId = selection
		if (!(channelData.AllowedUsers ?? []).includes(selectedUserId)) {
			return interaction.editReply({
				content: locale('components.menus.voiceHub.channelPermissions.options.allowedUsers.notAllowed'),
				embeds: [],
				components: [],
			})
		}

		await interaction.channel.permissionOverwrites.delete(selectedUserId)
		const updatedChannelData = await voiceTempChannelSchema.findOneAndUpdate(
			{ Guild: interaction.guild.id, ChannelId: interaction.channelId },
			{ $pull: { AllowedUsers: selectedUserId } },
			{ upsert: false, returnDocument: 'after' }
		)
		await updateVoiceHubPanel(interaction.channel, updatedChannelData, locale).catch(() => {})

		return interaction.editReply({
			content: locale(
				'components.menus.voiceHub.channelPermissions.options.allowedUsers.removed',
				{ user: `<@${selectedUserId}>` }
			),
			embeds: [],
			components: [],
			allowedMentions: { parse: [] },
		})
	},
}

function getCurrentPage(message) {
	const footerText = message.embeds?.[0]?.footer?.text ?? ''
	const [, pageNumber] = footerText.match(/(\d+)\s*\/\s*\d+/) ?? []

	return Math.max(Number(pageNumber ?? 1) - 1, 0)
}

export default tempChannelAllowedUsersMenu
