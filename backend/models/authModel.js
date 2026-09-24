const { model, Schema } = require('mongoose')

const authSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        unique: true
    },
    // When this changes, JWTs issued before the change are no longer valid.
    passwordChangedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = model('authors', authSchema)