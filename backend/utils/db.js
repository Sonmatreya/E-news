const mongoose = require('mongoose')
const db_connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.mode === 'production' ? process.env.db_production_url : process.env.MONGODB_URI)
        console.log('Mongodb Connected Successfully')
        return conn
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = db_connect
