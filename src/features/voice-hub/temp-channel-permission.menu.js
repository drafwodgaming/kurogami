import { ActionRowBuilder, UserSelectMenuBuilder, MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const channelPermissionMenu = {
	id: 'channelPermission',
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const [selectedAction] = interaction.values

		const voiceTempChannelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!voiceTempChannelData) {
			return await interaction.editReply({
				content: locale('events.voiceHub.messages.channelNotFound'),
			})
		}

		switch (selectedAction) {
			case 'channelLock':
			case 'channelUnlock': {
				await interaction.channel.permissionOverwrites.edit(
					interaction.channel.guild.roles.everyone,
					{ Connect: selectedAction === 'channelLock' ? false : true }
				)

				await interaction.editReply({
					content: locale('events.voiceHub.messages.permissionsUpdated'),
				})
				break
			}

			case 'channelInvite': {
				const userSelector = new UserSelectMenuBuilder()
					.setCustomId('inviteUser')
					.setPlaceholder(locale('components.menus.voiceHub.channelInvite.placeholder'))

				await interaction.editReply({
					components: [new ActionRowBuilder().addComponents(userSelector)],
				})
				break
			}
		}

		const container = buildVoiceHubContainer(locale, voiceTempChannelData.isPersistent)
		await interaction.message.edit({ components: [container] }).catch(() => {})
	},
}

export default channelPermissionMenu
