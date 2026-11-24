import { ActionRowBuilder, MessageFlags, UserSelectMenuBuilder } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import { updateVoiceHubPanel } from '../../utils/voiceHub/build-voice-hub-container.js'
import { buildAllowedUsersView } from './temp-channel-allowed-users.menu.js'

const ACTIONS = {
	lock: 'channelLock',
	unlock: 'channelUnlock',
	invite: 'channelInvite',
	manageAllowedUsers: 'channelAllowedUsers',
}

const channelPermissionMenu = {
	id: 'channelPermission',

	async execute(interaction) {
		await interaction.deferUpdate()

		const locale = await getLocalizedText(interaction)
		const roomData = await voiceTempChannelSchema.findOne({
			Guild: interaction.guild.id,
			ChannelId: interaction.channelId,
		})

		if (!roomData) {
			return interaction.followUp({
				content: locale('events.voiceHub.messages.channelNotFound'),
				flags: MessageFlags.Ephemeral,
			})
		}

		if (roomData.Creator !== interaction.user.id) {
			return interaction.followUp({
				content: locale('events.voiceHub.messages.notCreator'),
				flags: MessageFlags.Ephemeral,
			})
		}

		const [action] = interaction.values

		switch (action) {
			case ACTIONS.invite:
				return showInviteSelector(interaction, roomData, locale)
			case ACTIONS.manageAllowedUsers:
				return showAllowedUsers(interaction, roomData, locale)
			case ACTIONS.lock:
			case ACTIONS.unlock:
				return setRoomLockState(interaction, roomData, locale, action)
			default:
				return
		}
	},
}

async function showInviteSelector(interaction, roomData, locale) {
	const userSelector = new UserSelectMenuBuilder()
		.setCustomId('inviteUser')
		.setPlaceholder(locale('components.menus.voiceHub.channelInvite.placeholder'))

	await updateVoiceHubPanel(interaction.channel, roomData, locale, interaction.message)

	return interaction.followUp({
		components: [new ActionRowBuilder().addComponents(userSelector)],
		flags: MessageFlags.Ephemeral,
	})
}

async function showAllowedUsers(interaction, roomData, locale) {
	await updateVoiceHubPanel(interaction.channel, roomData, locale, interaction.message)

	const allowedUsers = roomData.AllowedUsers ?? []
	const view = await buildAllowedUsersView(interaction.guild, allowedUsers, locale)

	return interaction.followUp({
		embeds: view.embeds,
		components: view.components,
		flags: MessageFlags.Ephemeral,
	})
}

async function setRoomLockState(interaction, roomData, locale, action) {
	const isLocked = action === ACTIONS.lock
	await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
		Connect: !isLocked,
	})

	const updatedRoomData = await voiceTempChannelSchema.findOneAndUpdate(
		{ Guild: interaction.guild.id, ChannelId: interaction.channelId },
		{ $set: { IsLocked: isLocked } },
		{ upsert: false, returnDocument: 'after' }
	)

	await updateVoiceHubPanel(
		interaction.channel,
		updatedRoomData,
		locale,
		interaction.message
	)

	return interaction.followUp({
		content: locale('events.voiceHub.messages.permissionsUpdated'),
		flags: MessageFlags.Ephemeral,
	})
}

export default channelPermissionMenu
