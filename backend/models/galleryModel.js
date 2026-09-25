const { model, Schema } = require('mongoose')

const galler_schema = new Schema({
    photographerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'authors'
    },
    photographerName: {
        type: String,
        required: true,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'used'],
        default: 'available'
    }
}, { timestamps: true })

module.exports = model('images', galler_schema)
