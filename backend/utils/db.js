const mongoose = require('mongoose')

const db_connect = async () => {
    try {

        const dbUrl =
            process.env.MODE === 'production'
                ? process.env.DB_PRODUCTION_URL
                : process.env.MONGODB_URI

        const conn = await mongoose.connect(dbUrl)

        console.log('MongoDB Connected Successfully')
        return conn

    } catch (error) {
        console.log('Database connection error:', error)
        throw error
    }
}

module.exports = db_connect
