import { Schema, model } from 'mongoose'

const serverlocaleSchema = new Schema({
	Guild: {
		type: String,
		required: true,
		unique: true,
	},
	Language: {
		type: String,
		required: true,
		enum: ['en', 'ru', 'uk'],
	},
})

export default model('serverlocales', serverlocaleSchema)
