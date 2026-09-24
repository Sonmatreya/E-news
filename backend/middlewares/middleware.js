const jwt = require('jsonwebtoken')
const authModel = require('../models/authModel')

class middleware {

    auth = async (req, res, next) => {

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const token = authHeader.slice(7).trim()

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured')
            return res.status(500).json({ message: 'Authentication service is not configured' })
        }

        try {
            const tokenInfo = await jwt.verify(token, process.env.JWT_SECRET)

            if (!tokenInfo.id) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            // Always verify the account against the database.
            // This prevents a valid old JWT from working after the account
            // is deleted or its role is changed.
            const user = await authModel.findById(tokenInfo.id).select('name email category role employeeId image')

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            req.userInfo = {
                ...tokenInfo,
                id: user.id,
                name: user.name,
                email: user.email,
                category: user.category,
                role: user.role,
                employeeId: user.employeeId,
                image: user.image || ''
            }

            next()
        } catch (error) {
            console.log('Authentication error:', error.message)
            return res.status(401).json({ message: 'Unauthorized' })
        }
    }

    role = async (req, res, next) => {
        const { userInfo } = req

        if (!userInfo) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (userInfo.role === 'admin') {
            return next()
        }

        return res.status(403).json({ message: 'Forbidden' })
    }

    editorOrAdmin = async (req, res, next) => {
        const { userInfo } = req

        if (!userInfo) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (userInfo.role === 'admin' || userInfo.role === 'editor') {
            return next()
        }

        return res.status(403).json({ message: 'Forbidden' })
    }

    writerOrAbove = async (req, res, next) => {
        const { userInfo } = req

        if (!userInfo) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (['admin', 'editor', 'writer'].includes(userInfo.role)) {
            return next()
        }

        return res.status(403).json({ message: 'Forbidden' })
    }
}

module.exports = new middleware()
