import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js'
import { createVoiceChannel } from '../../utils/voiceHub/create-voice-channel.js'
import emojis from '../../../config/bot/emojis.json' with { type: 'json' }
import { getColor } from '../../utils/general/get-color.js'
import { getLocalizedText } from '../../utils/general/get-locale.js'
import voiceHubCreatorSchema from '../../schemas/voice-hub.schema.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

export default class Voicehub {
	name = 'voiceStateUpdate'
	once = false
	async execute(oldState, newState) {
		const locale = await getLocalizedText(newState.member)

		if (oldState.channelId === newState.channelId) {
			return
		}

		const defaultBotColor = getColor('bot', '0x')

		if (!oldState.channel && newState.channel) {
			const voiceHubData = await voiceHubCreatorSchema.findOne({ Guild: newState.guild.id }).lean()

			if (!voiceHubData || newState.channel.id !== voiceHubData.Channel) {
				return
			}

			const parentCategory = newState.channel.parent
			const channel = await createVoiceChannel(newState.guild, newState.member, parentCategory)

			await voiceTempChannelSchema.create({
				Guild: newState.guild.id,
				ChannelId: channel.id,
				Creator: newState.member.id,
				ChannelName: channel.name,
				Limit: channel.userLimit,
			})

			const embed = {
				color: defaultBotColor,
				title: locale('events.voiceHub.title'),
				description: `${locale('events.voiceHub.description.customize')} 
			${locale('events.voiceHub.description.important')}`,
				footer: { text: 'Anper Voice Interface' },
			}

			const channelSettings = new StringSelectMenuBuilder()
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

			const channelPermission = new StringSelectMenuBuilder()
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
				])
				.setMaxValues(1)

			const channelSettingsRow = new ActionRowBuilder().addComponents(channelSettings)

			const channelPermissionRow = new ActionRowBuilder().addComponents(channelPermission)

			await channel.send({
				embeds: [embed],
				components: [channelSettingsRow, channelPermissionRow],
			})

			await newState.setChannel(channel).catch(() => {})
		}

		if (oldState.channel && !newState.channel) {
			const voiceTempChannelData = await voiceTempChannelSchema.findOne({
				ChannelId: oldState.channel.id,
			})

			if (!voiceTempChannelData) {
				return
			}

			const channel = oldState.guild.channels.resolve(oldState.channel.id)

			if (channel && channel.members.size === 0) {
				await voiceTempChannelData.deleteOne({ ChannelId: oldState.channel.id })
				await channel.delete().catch(() => {})
			}
		}
	}
}
