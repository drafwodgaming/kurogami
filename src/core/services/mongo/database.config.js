import mongoose from 'mongoose'

const DB_OPTIONS = {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45_000,
}

const setupEventListeners = logger => {
	mongoose.connection.once('connected', () => logger.info(`🧠 Connected to MongoDB`))
	mongoose.connection.once('error', error => logger.error(`❗ MongoDB connection error:`, error))
	mongoose.connection.once('disconnected', () => logger.warn(`🔌 Disconnected from MongoDB`))
	mongoose.connection.once('reconnected', () => logger.info(`🔃 Reconnected to MongoDB`))
}

export default { DB_OPTIONS, setupEventListeners }
