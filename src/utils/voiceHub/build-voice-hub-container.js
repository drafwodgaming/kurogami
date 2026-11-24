import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import getColor from '../general/get-color.js'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
} from 'discord.js'

const buildRoomStatusRow = (locale, roomData) =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('channelLockStatus')
			.setLabel(locale(`events.voiceHub.status.${roomData.IsLocked ? 'locked' : 'unlocked'}`))
			.setStyle(roomData.IsLocked ? ButtonStyle.Danger : ButtonStyle.Success)
			.setDisabled(true),
		new ButtonBuilder()
			.setCustomId('channelAllowedUsersStatus')
			.setLabel(
				locale('events.voiceHub.status.allowedUsers', {
					count: roomData.AllowedUsers?.length ?? 0,
				})
			)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true)
	)

const buildRoomSettingsMenu = locale =>
	new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('channelSettings')
			.setPlaceholder(locale('components.menus.voiceHub.channelSettings.placeholder'))
			.setOptions([
				{
					label: locale('components.menus.voiceHub.channelSettings.options.name.label'),
					description: locale(
						'components.menus.voiceHub.channelSettings.options.name.description'
					),
					value: 'channelName',
					emoji: emojis.nameTag,
				},
				{
					label: locale('components.menus.voiceHub.channelSettings.options.limit.label'),
					description: locale(
						'components.menus.voiceHub.channelSettings.options.limit.description'
					),
					value: 'channelLimit',
					emoji: emojis.limitPeople,
				},
			])
	)

const buildRoomPermissionsMenu = locale =>
	new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('channelPermission')
			.setPlaceholder(locale('components.menus.voiceHub.channelPermissions.placeholder'))
			.setOptions([
				{
					label: locale('components.menus.voiceHub.channelPermissions.options.lock.label'),
					description: locale(
						'components.menus.voiceHub.channelPermissions.options.lock.description'
					),
					value: 'channelLock',
					emoji: emojis.lockChannel,
				},
				{
					label: locale('components.menus.voiceHub.channelPermissions.options.unlock.label'),
					description: locale(
						'components.menus.voiceHub.channelPermissions.options.unlock.description'
					),
					value: 'channelUnlock',
					emoji: emojis.unlockChannel,
				},
				{
					label: locale('components.menus.voiceHub.channelInvite.options.invite.label'),
					description: locale(
						'components.menus.voiceHub.channelInvite.options.invite.description'
					),
					value: 'channelInvite',
					emoji: emojis.invite,
				},
				{
					label: locale(
						'components.menus.voiceHub.channelPermissions.options.allowedUsers.label'
					),
					description: locale(
						'components.menus.voiceHub.channelPermissions.options.allowedUsers.description'
					),
					value: 'channelAllowedUsers',
					emoji: emojis.commands,
				},
			])
	)

const buildVoiceHubContainer = (locale, channelData = {}) => {
	const roomData = channelData ?? {}
	const description = new TextDisplayBuilder().setContent(
		locale('events.voiceHub.description.customize')
	)
	const expirationNotice = new TextDisplayBuilder().setContent(
		locale('events.voiceHub.description.important')
	)
	const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)

	return new ContainerBuilder()
		.addActionRowComponents(buildRoomStatusRow(locale, roomData))
		.addTextDisplayComponents(description, expirationNotice)
		.addSeparatorComponents(separator)
		.addActionRowComponents(buildRoomSettingsMenu(locale), buildRoomPermissionsMenu(locale))
		.setAccentColor(getColor('bot', '0x'))
}

export const updateVoiceHubPanel = async (channel, roomData, locale, fallbackMessage) => {
	const panelMessage = roomData?.PanelMessageId
		? await channel.messages.fetch(roomData.PanelMessageId).catch(() => fallbackMessage)
		: fallbackMessage

	if (!panelMessage) return

	return panelMessage.edit({
		components: [buildVoiceHubContainer(locale, roomData)],
	})
}

export default buildVoiceHubContainer
