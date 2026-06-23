import mongoose from 'mongoose'
import dbConfig from './database.config.js'

export default {
	async connect(connectionUri, logger) {
		if (!connectionUri) {
			throw new Error('DatabaseService: connectionUri is required')
		}

		dbConfig.setupEventListeners(logger)
		await mongoose.connect(connectionUri, dbConfig.DB_OPTIONS)
	},

	async disconnect() {
		await mongoose.disconnect()
	},
}
