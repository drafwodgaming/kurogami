import getLocalizedText from '../../utils/general/get-locale.js'
import voiceTempChannelSchema from '../../schemas/voice-temp-channel.schema.js'
import { updateVoiceHubPanel } from '../../utils/voiceHub/build-voice-hub-container.js'

const tempChannelInviteMenu = {
	id: 'inviteUser',

	async execute(interaction) {
		await interaction.deferUpdate()

		const locale = await getLocalizedText(interaction)
		const [userId] = interaction.values

		const channelData = await voiceTempChannelSchema.findOne({
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

		let message

		try {
			const member = await interaction.guild.members.fetch(userId)
			await interaction.channel.permissionOverwrites.edit(member.id, {
				Connect: true,
				ViewChannel: true,
			})
			const updatedChannelData = await voiceTempChannelSchema.findOneAndUpdate(
				{ Guild: interaction.guild.id, ChannelId: interaction.channelId },
				{ $addToSet: { AllowedUsers: member.id } },
				{ upsert: false, returnDocument: 'after' }
			)
			await updateVoiceHubPanel(interaction.channel, updatedChannelData, locale).catch(() => {})

			message = locale('components.menus.voiceHub.channelInvite.messages.success')
			await member
				.send({
					content: `You have been invited to join the channel: ${interaction.channel.url}`,
				})
				.catch(() => {
					message = locale('components.menus.voiceHub.channelInvite.messages.successDmFailed')
				})
		} catch {
			message = locale('components.menus.voiceHub.channelInvite.messages.error')
		}

		return interaction.editReply({
			content: message,
			components: [],
		})
	},
}

export default tempChannelInviteMenu
