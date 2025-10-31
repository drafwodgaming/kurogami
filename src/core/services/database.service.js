import mongoose from 'mongoose'

export class DatabaseService {
	constructor(connectionUri, logger) {
		this.connectionUri = connectionUri
		this.logger = logger
		this.eventHandlers = null
		this.#setupEventListeners()
	}

	#setupEventListeners() {
		if (this.eventHandlers) {
			return
		}

		const { connection } = mongoose

		this.eventHandlers = {
			connected: () => this.logger.info('🧠 Connected to MongoDB'),
			error: error => this.logger.error('❗MongoDB connection error:', error),
			disconnected: () => this.logger.warn('🔌 Disconnected from MongoDB'),
			reconnected: () => this.logger.info('🔃 Reconnected to MongoDB'),
		}

		Object.entries(this.eventHandlers).forEach(([event, handler]) => {
			connection.on(event, handler)
		})
	}

	async connect() {
		await mongoose.connect(this.connectionUri, this.dbOptions)
	}

	async disconnect() {
		await mongoose.disconnect()
	}
}
