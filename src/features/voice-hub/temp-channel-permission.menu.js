import { ActionRowBuilder, UserSelectMenuBuilder, MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import buildVoiceHubContainer from '../../utils/voiceHub/build-voice-hub-container.js'

const channelPermissionMenu = {
	id: 'channelPermission',

	async execute(interaction) {
		await interaction.deferUpdate()

		const locale = await getLocalizedText(interaction)
		const [action] = interaction.values

		const channelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!channelData) {
			return interaction.followUp({
				content: locale('events.voiceHub.messages.channelNotFound'),
				flags: MessageFlags.Ephemeral,
			})
		}

		if (action === 'channelInvite') {
			const userSelector = new UserSelectMenuBuilder()
				.setCustomId('inviteUser')
				.setPlaceholder(locale('components.menus.voiceHub.channelInvite.placeholder'))

			await interaction.message.edit({
				components: [buildVoiceHubContainer(locale, channelData.isPersistent)],
			})

			return interaction.followUp({
				components: [new ActionRowBuilder().addComponents(userSelector)],
				flags: MessageFlags.Ephemeral,
			})
		}

		await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
			Connect: action !== 'channelLock',
		})

		await interaction.message.edit({
			components: [buildVoiceHubContainer(locale, channelData.isPersistent)],
		})

		return interaction.followUp({
			content: locale('events.voiceHub.messages.permissionsUpdated'),
			flags: MessageFlags.Ephemeral,
		})
	},
}

export default channelPermissionMenu
