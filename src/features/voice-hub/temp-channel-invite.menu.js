import { getLocalizedText } from '../../utils/general/get-locale.js'

export default class TempChannelInvite {
	id = 'inviteUser'
	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const [selectedUserId] = interaction.values
		let content

		try {
			const selectedUser = await interaction.guild.members.fetch(selectedUserId)

			await selectedUser.send({
				content: `You have been invited to join the channel: ${interaction.channel.url}`,
			})

			content = locale('components.menus.voiceHub.channelInvite.messages.success')
		} catch {
			content = locale('components.menus.voiceHub.channelInvite.messages.error')
		}

		await interaction.update({ content, components: [], flags: 64 })
	}
}
