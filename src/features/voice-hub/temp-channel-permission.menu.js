import { ActionRowBuilder, UserSelectMenuBuilder } from 'discord.js'
import { getLocalizedText } from '../../utils/general/get-locale.js'

export default class TempChannelPermission {
	id = 'channelPermission'
	async execute(interaction) {
		await interaction.deferReply({ flags: 64 })

		const locale = await getLocalizedText(interaction)
		const [selectedAction] = interaction.values

		switch (selectedAction) {
			case 'channelLock': {
				await interaction.channel.permissionOverwrites.edit(
					interaction.channel.guild.roles.everyone,
					{
						Connect: false,
					}
				)
				await interaction.editReply({
					content: locale('events.voiceHub.messages.permissionsUpdated'),
				})
				break
			}
			case 'channelUnlock': {
				await interaction.channel.permissionOverwrites.edit(
					interaction.channel.guild.roles.everyone,
					{
						Connect: true,
					}
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

				const inviteRow = new ActionRowBuilder().addComponents(userSelector)

				await interaction.editReply({ components: [inviteRow] })
				break
			}
			default:
				break
		}
	}
}
