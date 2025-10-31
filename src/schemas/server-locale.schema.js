import { Schema, model } from 'mongoose'

const serverlocaleSchema = new Schema({
	Guild: {
		type: String,
	},
	Language: {
		type: String,
	},
})

export default model('serverlocales', serverlocaleSchema)
