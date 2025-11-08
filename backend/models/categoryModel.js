const { model, Schema } = require('mongoose')

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
}, { timestamps: true })

module.exports = model('category', categorySchema)
