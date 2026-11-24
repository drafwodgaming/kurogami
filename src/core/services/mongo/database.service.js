import mongoose from 'mongoose'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
const database = {
  async connect(uri, logger) {
    if (!uri) {
      throw new Error('MongoDB URI is required')
    }

    if (mongoose.connection.readyState === 1) {
      logger.debug('MongoDB is already connected')
      return mongoose.connection
    }

    logger.info('Connecting to MongoDB...')

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000
    })

    logger.info('Connected to MongoDB')

    return mongoose.connection
  },

  async disconnect() {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
  }
}

export default database
