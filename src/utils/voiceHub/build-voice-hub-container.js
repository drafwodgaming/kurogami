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

const persistenceConfig = {
	true: { label: 'persistent', style: ButtonStyle.Success },
	false: { label: 'temporary', style: ButtonStyle.Danger },
}

const buildVoiceHubContainer = (locale, isPersistent) => {
	const defaultBotColor = getColor('bot', '0x')
	const { label, style } = persistenceConfig[isPersistent]

	const title = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('channelPersistenceIndicator')
			.setLabel(locale(`events.voiceHub.persistenceStatus.${label}.label`))
			.setStyle(style)
			.setDisabled(true)
	)

	const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
	const description = new TextDisplayBuilder().setContent(
		locale('events.voiceHub.description.customize')
	)
	const important = new TextDisplayBuilder().setContent(
		locale('events.voiceHub.description.important')
	)

	const channelSettings = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('channelSettings')
			.setPlaceholder(locale('components.menus.voiceHub.channelSettings.placeholder'))
			.setOptions([
				{
					label: locale('components.menus.voiceHub.channelSettings.options.name.label'),
					description: locale('components.menus.voiceHub.channelSettings.options.name.description'),
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
				{
					label: locale('components.menus.voiceHub.channelSettings.options.persistent.label'),
					description: locale(
						'components.menus.voiceHub.channelSettings.options.persistent.description'
					),
					value: 'channelPersistent',
					emoji: emojis.pinChannel,
				},
			])
	)

	const channelPermission = new ActionRowBuilder().addComponents(
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
					description: locale('components.menus.voiceHub.channelInvite.options.invite.description'),
					value: 'channelInvite',
					emoji: emojis.invite,
				},
			])
			.setMaxValues(1)
	)

	return new ContainerBuilder()
		.addActionRowComponents(title)
		.addSeparatorComponents(separator)
		.addTextDisplayComponents(description, important)
		.addActionRowComponents(channelSettings, channelPermission)
		.setAccentColor(defaultBotColor)
}

export default buildVoiceHubContainer
