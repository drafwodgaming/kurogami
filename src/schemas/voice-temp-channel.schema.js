import { Schema, model } from 'mongoose'

const voiceTempChannelSchema = new Schema({
	Guild: {
		type: String,
		required: true,
		index: true,
	},
	ChannelId: {
		type: String,
		required: true,
	},
	Creator: {
		type: String,
		required: true,
	},
	ChannelName: {
		type: String,
	},
	Limit: {
		type: Number,
		min: 0,
		max: 99,
	},
	RenameTime: {
		type: Number,
		default: 0,
	},
	IsLocked: {
		type: Boolean,
		default: false,
	},
	AllowedUsers: {
		type: [String],
		default: [],
	},
	PanelMessageId: {
		type: String,
	},
})

voiceTempChannelSchema.index({ Guild: 1, ChannelId: 1 }, { unique: true })

export default model('voicetempchannels', voiceTempChannelSchema)
