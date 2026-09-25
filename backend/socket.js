const jwt = require('jsonwebtoken')
const authModel = require('./models/authModel')

const setupSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token

            if (!token || !process.env.JWT_SECRET) {
                return next(new Error('Unauthorized'))
            }

            const tokenInfo = jwt.verify(token, process.env.JWT_SECRET)

            if (!tokenInfo.id) {
                return next(new Error('Unauthorized'))
            }

            const user = await authModel.findById(tokenInfo.id)
                .select('name email category role employeeId image passwordChangedAt')

            if (!user) {
                return next(new Error('Unauthorized'))
            }

            if (
                user.passwordChangedAt &&
                (!tokenInfo.iat || tokenInfo.iat * 1000 < user.passwordChangedAt.getTime())
            ) {
                return next(new Error('Session expired'))
            }

            socket.userInfo = {
                id: user.id,
                name: user.name,
                email: user.email,
                category: user.category,
                role: user.role,
                employeeId: user.employeeId
            }

            next()
        } catch (error) {
            next(new Error('Unauthorized'))
        }
    })

    io.on('connection', (socket) => {
        socket.join(`role:${socket.userInfo.role}`)
        socket.join(`user:${socket.userInfo.id}`)

        console.log(
            `Socket connected: ${socket.userInfo.name} (${socket.userInfo.role})`
        )

        socket.on('disconnect', () => {
            console.log(
                `Socket disconnected: ${socket.userInfo.name} (${socket.userInfo.role})`
            )
        })
    })
}

const emitNewsEvent = (req, event, news) => {
    const io = req.app.get('io')

    if (!io || !news) {
        return
    }

    io.emit(event, {
        newsId: news._id?.toString(),
        status: news.status || null,
        category: news.category || null,
        writerId: news.writerId?.toString() || null,
        assignedTo: news.assignedTo?.toString() || null
    })
}

module.exports = {
    setupSocket,
    emitNewsEvent
}
