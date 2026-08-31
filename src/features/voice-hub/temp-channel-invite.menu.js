import { MessageFlags } from 'discord.js'
import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'

const tempChannelInviteMenu = {
	id: 'inviteUser',

	async execute(interaction) {
		const locale = await getLocalizedText(interaction)
		const [userId] = interaction.values

		const channelData = await voiceTempChannelSchema.findOne({
			ChannelId: interaction.channelId,
		})

		if (!channelData) {
			return interaction.update({
				components: [],
			})
		}

		let message

		try {
			const member = await interaction.guild.members.fetch(userId)

			await member.send({
				content: `You have been invited to join the channel: ${interaction.channel.url}`,
			})

			message = locale('components.menus.voiceHub.channelInvite.messages.success')
		} catch {
			message = locale('components.menus.voiceHub.channelInvite.messages.error')
		}

		return interaction.reply({
			content: message,
			flags: MessageFlags.Ephemeral,
		})
	},
}

export default tempChannelInviteMenu
