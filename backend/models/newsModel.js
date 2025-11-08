const { model, Schema } = require('mongoose')

const newsSchema = new Schema({
    writerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'authors'
    },
    writerName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'authors'
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed_by_writer', 'reviewed_by_editor', 'published', 'rejected', 'deactive', 'rework_needed'],
        default: 'draft'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'under review', 'verified_by_writer', 'verified_by_editor', 'final', 'rework_needed'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    },
    returnTo: {
        type: String,
        enum: ['reporter', 'photographer', 'writer', 'editor', 'admin']
    },
    verifiedBy: {
        type: String,
        default: ''
    },
    verifiedAt: {
        type: Date
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

newsSchema.index({
    title: 'text',
    category: 'text',
    description: 'text'
}, {
    title: 5,
    description: 4,
    category: 2
})

module.exports = model('news', newsSchema)