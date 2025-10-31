import { createWelcomeCardMessage } from '../../utils/canvas/create-welcome-card-message.js'
import welcomeChannelSchema from '../../schemas/welcome-channel.schema.js'

export default class WelcomeCardMessage {
	name = 'guildMemberAdd'
	once = false
	async execute(member) {
		const { guild, user } = member
		const { channels, id } = guild

		if (user.bot) {
			return
		}

		const welcomeMessageData = await welcomeChannelSchema.findOne({
			Guild: id,
		})

		if (!welcomeMessageData) {
			return
		}

		const interactionChannel = channels.cache.get(welcomeMessageData.Channel)

		if (!interactionChannel) {
			return
		}

		const messageCanvas = await createWelcomeCardMessage(member)

		await interactionChannel.send({ files: [messageCanvas] })
	}
}
