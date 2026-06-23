import { Schema, model } from 'mongoose'

const welcomeChannelSchema = new Schema({
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

export default model('welcomechannels', welcomeChannelSchema)
