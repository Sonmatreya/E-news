const { formidable } = require('formidable')
const cloudinary = require('cloudinary').v2
const newsModel = require('../models/newsModel')
const authModel = require('../models/authModel')
const galleryModel = require('../models/galleryModel')
const categoryModel = require('../models/categoryModel')
const { mongo: { ObjectId } } = require('mongoose')
const moment = require('moment')

class newsController {
    add_news = async (req, res) => {
        console.log('Starting add_news')
        const { id, category, name, role } = req.userInfo
        console.log('userInfo:', req.userInfo)
        const form = formidable({})
       cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
         secure: true
       });
        try {

            const [fields, files] = await form.parse(req)
            console.log('fields:', fields)
            console.log('files:', files)

            if (!files.image || files.image.length === 0) {
                console.log('No image file provided')
                return res.status(400).json({ message: 'Image is required' })
            }

            const { url } = await cloudinary.uploader.upload(files.image[0].filepath, { folder: 'news_images' })
            const { title, description, category: selectedCategory } = fields
            const status = (role === 'reporter' || role === 'photographer') ? 'submitted' : 'draft'
            const news = await newsModel.create({
                writerId: id,
                title: title[0].trim(),
                slug: title[0].trim().split(' ').join('-'),
                category: selectedCategory ? selectedCategory[0] : category,
                description: description[0].replace(/\n/g, '<br>'),
                date: moment().format('LL'),
                time: moment().format('LTS'),
                writerName: name,
                image: url,
                status: status
            })
            return res.status(201).json({ message: 'News add success', news })
        } catch (error) {
            console.log('Error in add_news:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    update_news = async (req, res) => {

        const { news_id } = req.params
        const form = formidable({})

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        })

        try {
            const [fields, files] = await form.parse(req)
            const { title, description } = fields
            let url = fields.old_image[0]

            if (Object.keys(files).length > 0) {
                const spliteImage = url.split('/')
                const imagesFile = spliteImage[spliteImage.length - 1].split('.')[0]
                await cloudinary.uploader.destroy(imagesFile);
                const data = await cloudinary.uploader.upload(files.new_image[0].filepath, { folder: 'news_images' })
                url = data.url
            }

            const news = await newsModel.findByIdAndUpdate(news_id, {
                title: title[0].trim(),
                slug: title[0].trim().split(' ').join('-'),
                description: description[0].replace(/\n/g, '<br>'),
                image: url,
                date: moment().format('LL'),
                time: moment().format('LTS')
            }, { new: true })

            return res.status(200).json({ message: 'news update success', news })
        } catch (error) {
            console.log('Error in update_news:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    update_news_update = async (req, res) => {
        const { role, name } = req.userInfo
        const { news_id } = req.params
        const { status, verificationNotes } = req.body

        const news = await newsModel.findById(news_id)
        if (!news) {
            return res.status(404).json({ message: 'News not found' })
        }

        // Workflow logic with verification
        if (role === 'admin') {
            // Admin can publish, reject, or deactivate any news
            if (status === 'published') {
                const updateData = {
                    status,
                    verificationStatus: 'final',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Published by admin'
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (status === 'rejected') {
                const updateData = {
                    status: 'rework_needed',
                    verificationStatus: 'rework_needed',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Rejected by admin',
                    returnTo: 'editor' // Send back to editor
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (status === 'deactive') {
                const updateData = {
                    status,
                    verificationStatus: 'final',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Deactivated by admin'
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else {
                return res.status(401).json({ message: 'Admin can only publish, reject, or deactivate news' })
            }
        } else if (role === 'editor') {
            // Editor can review writer-verified news, rework needed news, or reject them
            if (news.status === 'reviewed_by_writer' && status === 'reviewed_by_editor') {
                const updateData = {
                    status,
                    verificationStatus: 'verified_by_editor',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Reviewed by editor'
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (news.status === 'rework_needed' && news.returnTo === 'editor' && status === 'reviewed_by_editor') {
                const updateData = {
                    status,
                    verificationStatus: 'verified_by_editor',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Reworked by editor'
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (status === 'rejected') {
                const updateData = {
                    status: 'rework_needed',
                    verificationStatus: 'rework_needed',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Rejected by editor',
                    returnTo: 'writer' // Send back to writer
                }
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, updateData, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else {
                return res.status(401).json({ message: 'Editor can only review writer-verified news, rework needed news, or reject them' })
            }
        } else if (role === 'writer') {
            // Writers can submit their own drafts or review submitted news and forward to editor
            if (news.status === 'draft' && status === 'submitted') {
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, {
                    status: 'submitted',
                    verificationStatus: 'under review',
                    notes: 'Submitted by writer'
                }, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (news.status === 'submitted' && status === 'reviewed_by_writer') {
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, {
                    status,
                    verificationStatus: 'verified_by_writer',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Submitted to editor by writer'
                }, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (news.status === 'rework_needed' && news.returnTo === 'writer' && status === 'reviewed_by_writer') {
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, {
                    status,
                    verificationStatus: 'verified_by_writer',
                    verifiedBy: name,
                    verifiedAt: new Date(),
                    notes: verificationNotes || 'Reworked by writer'
                }, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else {
                return res.status(401).json({ message: 'Can only submit drafts, review submitted news, or rework needed news' })
            }
        } else if (role === 'reporter' || role === 'photographer') {
            // Reporters and photographers can submit drafts
            if (news.status === 'draft' && status === 'submitted') {
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, {
                    status: 'submitted',
                    verificationStatus: 'under review',
                    notes: 'Submitted for review'
                }, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else if (news.status === 'rework_needed' && news.returnTo === role && status === 'submitted') {
                const updatedNews = await newsModel.findByIdAndUpdate(news_id, {
                    status: 'submitted',
                    verificationStatus: 'under review',
                    notes: 'Resubmitted after rework'
                }, { new: true })
                return res.status(200).json({ message: 'news status update success', news: updatedNews })
            } else {
                return res.status(401).json({ message: 'Can only submit drafts or resubmit reworked news' })
            }
        } else {
            return res.status(401).json({ message: 'You cannot access this api' })
        }
    }

    get_images = async (req, res) => {
        const { id } = req.userInfo

        try {
            const images = await galleryModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
            return res.status(201).json({ images })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_recent_news = async (req, res) => {
        try {
            const news = await newsModel.find({ status: 'published' }).sort({ createdAt: -1 }).skip(0).limit(6)
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_category_news = async (req, res) => {

        const { category } = req.params

        try {
            const news = await newsModel.find({
                $and: [
                    {
                        category: {
                            $eq: category
                        }
                    },
                    {
                        status: {
                            $eq: 'published'
                        }
                    }
                ]
            })
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    news_search = async (req, res) => {
        const { value } = req.query
        try {
            const news = await newsModel.find({
                status: 'published',
                $text: {
                    $search: value
                }
            })
            return res.status(201).json({ news })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    add_images = async (req, res) => {

        const form = formidable({})
        const { id } = req.userInfo

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        })

        try {
            const [_, files] = await form.parse(req)
            let allImages = []
            const { images } = files

            if (!images || images.length === 0) {
                return res.status(400).json({ message: 'No images provided' })
            }

            for (let i = 0; i < images.length; i++) {
                const { url } = await cloudinary.uploader.upload(images[i].filepath, { folder: 'news_images' })
                allImages.push({ writerId: id, url })
            }

            const image = await galleryModel.insertMany(allImages)
            return res.status(201).json({ images: image, message: "images upload success" })

        } catch (error) {
            console.log('Error in add_images:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_dashboard_news = async (req, res) => {
        const { id, role } = req.userInfo
        try {
            if (role === 'admin') {
                const news = await newsModel.find({}).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            } else if (role === 'editor') {
                // Editors see all news
                const news = await newsModel.find({}).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            } else if (role === 'writer') {
                // Writers see all news
                const news = await newsModel.find({}).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            } else {
                // Reporters, photographers see their own news
                const news = await newsModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 })
                return res.status(200).json({ news })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_dashboard_recent_news = async (req, res) => {
        const { id, role } = req.userInfo
        try {
            if (role === 'admin') {
                const news = await newsModel.find({}).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else if (role === 'editor') {
                // Editors see recent news submitted by writers for review, submitted news, and their reviewed news
                const news = await newsModel.find({ $or: [{ status: 'submitted' }, { status: 'reviewed_by_writer' }, { status: 'reviewed_by_editor' }] }).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else if (role === 'writer') {
                // Writers see their own recent drafts, 'submitted' status news to review, reviewed news, and rework needed news
                const news = await newsModel.find({ $or: [{ writerId: new ObjectId(id), status: 'draft' }, { status: 'submitted' }, { status: 'reviewed_by_writer' }, { status: 'rework_needed', returnTo: 'writer' }] }).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else {
                // Reporters, photographers see their own recent news
                const news = await newsModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_writer_stats = async (req, res) => {
        const { id, role } = req.userInfo
        try {
            if (role === 'admin') {
                const totalNews = await newsModel.countDocuments({})
                const draftNews = await newsModel.countDocuments({ status: 'draft' })
                const reviewNews = await newsModel.countDocuments({ status: 'review' })
                const approvedNews = await newsModel.countDocuments({ status: 'approved' })
                const publishedNews = await newsModel.countDocuments({ status: 'published' })
                const deactiveNews = await newsModel.countDocuments({ status: 'deactive' })

                return res.status(200).json({
                    totalNews,
                    draftNews,
                    reviewNews,
                    approvedNews,
                    publishedNews,
                    deactiveNews
                })
            } else if (role === 'editor') {
                const totalNews = await newsModel.countDocuments({})
                const draftNews = await newsModel.countDocuments({ status: 'draft' })
                const submittedNews = await newsModel.countDocuments({ status: 'submitted' })
                const reviewedByWriterNews = await newsModel.countDocuments({ status: 'reviewed_by_writer' })
                const reviewedByEditorNews = await newsModel.countDocuments({ status: 'reviewed_by_editor' })
                const publishedNews = await newsModel.countDocuments({ status: 'published' })
                const deactiveNews = await newsModel.countDocuments({ status: 'deactive' })

                return res.status(200).json({
                    totalNews,
                    submittedNews,
                    reviewedByWriterNews,
                    reviewedByEditorNews,
                    publishedNews,
                    deactiveNews
                })
            } else if (role === 'writer') {
                // For writers, show overall news stats since they manage the workflow
                const totalNews = await newsModel.countDocuments({})
                const draftNews = await newsModel.countDocuments({ status: 'draft' })
                const reviewNewsCount = await newsModel.countDocuments({ status: 'submitted' })
                const publishedNews = await newsModel.countDocuments({ status: 'published' })
                const deactiveNews = await newsModel.countDocuments({ status: 'deactive' })

                return res.status(200).json({
                    totalNews,
                    drafts: draftNews,
                    inReview: reviewNewsCount,
                    published: publishedNews,
                    deactive: deactiveNews
                })
            } else {
                // For reporters, photographers - show their own news stats
                const totalNews = await newsModel.countDocuments({ writerId: new ObjectId(id) })
                const draftNews = await newsModel.countDocuments({ writerId: new ObjectId(id), status: 'draft' })
                const reviewNewsCount = await newsModel.countDocuments({ writerId: new ObjectId(id), status: 'submitted' })
                const publishedNews = await newsModel.countDocuments({ writerId: new ObjectId(id), status: 'published' })
                const deactiveNews = await newsModel.countDocuments({ writerId: new ObjectId(id), status: 'deactive' })

                return res.status(200).json({
                    totalNews,
                    drafts: draftNews,
                    inReview: reviewNewsCount,
                    published: publishedNews,
                    deactive: deactiveNews
                })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_admin_stats = async (req, res) => {
        try {
            const totalNews = await newsModel.countDocuments({})
            const draftNews = await newsModel.countDocuments({ status: 'draft' })
            const submittedNews = await newsModel.countDocuments({ status: 'submitted' })
            const reviewedByWriterNews = await newsModel.countDocuments({ status: 'reviewed_by_writer' })
            const reviewedByEditorNews = await newsModel.countDocuments({ status: 'reviewed_by_editor' })
            const publishedNews = await newsModel.countDocuments({ status: 'published' })
            const deactiveNews = await newsModel.countDocuments({ status: 'deactive' })
            const writers = await authModel.countDocuments({ role: 'writer' })
            const reporters = await authModel.countDocuments({ role: 'reporter' })
            const photographers = await authModel.countDocuments({ role: 'photographer' })
            const editors = await authModel.countDocuments({ role: 'editor' })

            return res.status(200).json({
                totalNews,
                draftNews,
                reviewNews: submittedNews + reviewedByWriterNews,
                approvedNews: reviewedByEditorNews,
                publishedNews,
                deactiveNews,
                writers,
                reporters,
                photographers,
                editors
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_dashboard_single_news = async (req, res) => {
        const { news_id } = req.params
        try {
            const news = await newsModel.findById(news_id)
            return res.status(200).json({ news })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_dashboard_recent_news = async (req, res) => {
        const { id, role } = req.userInfo
        try {
            if (role === 'admin') {
                const news = await newsModel.find({}).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else if (role === 'editor') {
                // Editors see recent news they can manage
                const news = await newsModel.find({ $or: [{ status: 'submitted' }, { status: 'reviewed_by_writer' }, { status: 'reviewed_by_editor' }, { status: 'rework_needed', returnTo: 'editor' }] }).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else if (role === 'writer') {
                // Writers see all recent news
                const news = await newsModel.find({}).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            } else {
                // Reporters, photographers see their own recent news
                const news = await newsModel.find({ writerId: new ObjectId(id) }).sort({ createdAt: -1 }).limit(5)
                return res.status(200).json({ news })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }


    // website

    get_all_news = async (req, res) => {
        try {
            const category_news = await newsModel.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $match: {
                        status: 'published'
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        news: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                                slug: '$slug',
                                writerName: '$writerName',
                                image: '$image',
                                description: '$description',
                                date: '$date',
                                category: '$category'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        news: {
                            $slice: ['$news', 5]
                        }
                    }
                }
            ])

            const news = {}
            for (let i = 0; i < category_news.length; i++) {
                news[category_news[i].category] = category_news[i].news
            }
            return res.status(200).json({ news })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_news = async (req, res) => {

        const { slug } = req.params


        try {

            const news = await newsModel.findOneAndUpdate({ slug }, {
                $inc: { count: 1 }
            }, { new: true })

            const relateNews = await newsModel.find({
                $and: [
                    {
                        slug: {
                            $ne: slug
                        }
                    }, {
                        category: {
                            $eq: news.category
                        }
                    }, {
                        status: {
                            $eq: 'published'
                        }
                    }
                ]
            }).limit(4).sort({ createdAt: -1 })

            return res.status(200).json({ news: news ? news : {}, relateNews })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_categories = async (req, res) => {
        try {
            const categories = await newsModel.aggregate([
                {
                    $match: {
                        status: 'published'
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        count: 1
                    }
                }
            ])
            return res.status(200).json({ categories })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_popular_news = async (req, res) => {
        try {
            const popularNews = await newsModel.find({ status: 'published' }).sort({ count: -1 }).limit(4)
            return res.status(200).json({ popularNews })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_latest_news = async (req, res) => {
        try {
            const news = await newsModel.find({ status: 'published' }).sort({ createdAt: -1 }).limit(6)

            return res.status(200).json({ news })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
    get_images = async (req, res) => {
        try {
            const images = await newsModel.aggregate([
                {
                    $match: {
                        status: 'published'
                    }
                },
                {
                    $sample: {
                        size: 9
                    }
                },
                {
                    $project: {
                        image: 1
                    }
                }
            ])
            return res.status(200).json({ images })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    // New endpoints for reader site integration

    get_news_list = async (req, res) => {
        try {
            const { limit = 10, skip = 0, category } = req.query;
            const query = { status: 'published' };
            if (category) query.category = category;

            const news = await newsModel.find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(skip));

            const total = await newsModel.countDocuments(query);

            res.json({ success: true, data: news, total });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    get_single_news = async (req, res) => {
        try {
            const news = await newsModel.findById(req.params.id);
            if (!news || news.status !== 'published') {
                return res.status(404).json({ success: false, message: 'News not found' });
            }
            res.json({ success: true, data: news });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    get_categories_list = async (req, res) => {
        try {
            const categories = await newsModel.distinct('category', { status: 'published' });
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    delete_news = async (req, res) => {
        const { news_id } = req.params
        const { id, role } = req.userInfo

        try {
            const news = await newsModel.findById(news_id)
            if (!news) {
                return res.status(404).json({ message: 'News not found' })
            }

            // Check if user is admin or the writer of the news
            if (role !== 'admin' && news.writerId.toString() !== id) {
                return res.status(403).json({ message: 'You do not have permission to delete this news' })
            }

            // Delete image from Cloudinary
            if (news.image) {
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    secure: true
                })
                const spliteImage = news.image.split('/')
                const imagesFile = spliteImage[spliteImage.length - 1].split('.')[0]
                await cloudinary.uploader.destroy(imagesFile)
            }

            // Delete news from database
            await newsModel.findByIdAndDelete(news_id)

            return res.status(200).json({ message: 'News deleted successfully' })
        } catch (error) {
            console.log('Error in delete_news:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }



    // Category management methods for admin
    add_category = async (req, res) => {
        const { name, description } = req.body

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' })
        }

        try {
            const existingCategory = await categoryModel.findOne({ name: name.trim() })
            if (existingCategory) {
                return res.status(400).json({ message: 'Category already exists' })
            }

            const category = await categoryModel.create({
                name: name.trim(),
                slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
                description: description ? description.trim() : ''
            })

            return res.status(201).json({ message: 'Category created successfully', category })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_categories_admin = async (req, res) => {
        try {
            const categories = await categoryModel.find({}).sort({ createdAt: -1 })
            return res.status(200).json({ categories })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    update_category = async (req, res) => {
        const { category_id } = req.params
        const { name, description, status } = req.body

        try {
            const category = await categoryModel.findByIdAndUpdate(
                category_id,
                {
                    name: name ? name.trim() : undefined,
                    slug: name ? name.trim().toLowerCase().replace(/\s+/g, '-') : undefined,
                    description: description ? description.trim() : undefined,
                    status: status || undefined
                },
                { new: true }
            )

            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            return res.status(200).json({ message: 'Category updated successfully', category })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    delete_category = async (req, res) => {
        const { category_id } = req.params

        try {
            const category = await categoryModel.findById(category_id)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            // Check if category is being used by any news
            const newsCount = await newsModel.countDocuments({ category: category.name })
            if (newsCount > 0) {
                return res.status(400).json({ message: 'Cannot delete category that has associated news' })
            }

            await categoryModel.findByIdAndDelete(category_id)
            return res.status(200).json({ message: 'Category deleted successfully' })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    get_active_categories = async (req, res) => {
        try {
            const categories = await categoryModel.find({ status: 'active' }).sort({ name: 1 })
            return res.status(200).json({ categories })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    clear_sample_data = async (req, res) => {
        try {
            await newsModel.deleteMany({});
            return res.status(200).json({ message: 'All sample news data cleared' });
        } catch (error) {
            return res.status(500).json({ message: 'Error clearing data' });
        }
    }
}
module.exports = new newsController()

