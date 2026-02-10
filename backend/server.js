const express = require('express')
const app = express()
const dotenv = require('dotenv')
const body_parser = require('body-parser')
const cors = require('cors')
const db_connect = require('./utils/db')

// Trust proxy for IP detection
app.set('trust proxy', 1)

dotenv.config()

app.use(body_parser.json())

// CORS CONFIG
const allowedOrigins = process.env.MODE === 'production'
    ? ['https://e-news-reader.onrender.com']
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/newsRoute'))

app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.PORT || 5000

const startServer = async () => {
    try {
        await db_connect()
        app.listen(port, () => console.log(`Server running on port ${port}`))
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
