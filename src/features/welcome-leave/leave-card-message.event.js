import { createLeaveCardMessage } from '../../utils/canvas/create-leave-card-message.js'
import leaveChannelSchema from '../../schemas/leave-channel.schema.js'

export default class LeaveCardMessage {
	name = 'guildMemberRemove'
	once = false
	async execute(member) {
		const { guild, user } = member
		const { channels, id } = guild

		if (user.bot) {
			return
		}

		const leaveMessageData = await leaveChannelSchema.findOne({
			Guild: id,
		})

		if (!leaveMessageData) {
			return
		}

		const interactionChannel = channels.cache.get(leaveMessageData.Channel)

		if (!interactionChannel) {
			return
		}

		const messageCanvas = await createLeaveCardMessage(member)

		await interactionChannel.send({ files: [messageCanvas] })
	}
}
