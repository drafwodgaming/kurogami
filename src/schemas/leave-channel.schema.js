import { Schema, model } from 'mongoose'

const leaveChannelSchema = new Schema({
	Guild: {
		type: String,
		required: true,
		unique: true,
	},
	Channel: {
		type: String,
		required: true,
	},
})

export default model('leavechannels', leaveChannelSchema)
