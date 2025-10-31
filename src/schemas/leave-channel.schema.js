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
		unique: true,
	},
})

export default model('leavechannels', leaveChannelSchema)
