const fetchGNews = async (req, res) => {
    const {
        category = 'general',
        country = 'in',
        lang = 'en',
        max = '10',
        q
    } = req.query

    if (!process.env.GNEWS_API_KEY) {
        console.error('GNEWS_API_KEY is not configured')
        return res.status(500).json({ message: 'External news service is not configured' })
    }

    const allowedCategories = [
        'general',
        'world',
        'nation',
        'business',
        'technology',
        'entertainment',
        'sports',
        'science',
        'health'
    ]

    const safeCategory = allowedCategories.includes(category) ? category : 'general'
    const safeMax = Math.min(Math.max(parseInt(max, 10) || 10, 1), 10)

    try {
        const params = new URLSearchParams({
            category: safeCategory,
            country: String(country),
            lang: String(lang),
            max: String(safeMax)
        })

        if (q && String(q).trim()) {
            params.delete('category')
            params.set('q', String(q).trim().slice(0, 200))
            params.set('sortby', 'publishedAt')
        }

        const response = await fetch(
            `https://gnews.io/api/v4/${q && String(q).trim() ? 'search' : 'top-headlines'}?${params.toString()}`,
            {
                headers: {
                    'X-Api-Key': process.env.GNEWS_API_KEY
                }
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('GNews API error:', response.status, data)
            return res.status(response.status === 429 ? 429 : response.status === 403 ? 503 : 502).json({
                message: 'Unable to fetch external news right now'
            })
        }

        const articles = (data.articles || []).map((article) => ({
            title: article.title,
            description: article.description || '',
            content: article.content || '',
            url: article.url,
            image: article.image || '',
            publishedAt: article.publishedAt,
            source: {
                name: article.source?.name || '',
                url: article.source?.url || ''
            }
        }))

        return res.status(200).json({
            source: 'GNews',
            totalArticles: data.totalArticles || articles.length,
            articles
        })
    } catch (error) {
        console.error('GNews request failed:', error.message)
        return res.status(502).json({ message: 'Unable to fetch external news' })
    }
}

const importGNews = async (req, res) => {
    const { id: adminId, role: adminRole } = req.userInfo
    const {
        title,
        description,
        image,
        url,
        sourceName,
        sourceUrl,
        category,
        assignedTo
    } = req.body

    if (adminRole !== 'admin') {
        return res.status(403).json({ message: 'Only admin can import external news' })
    }

    if (!title || !String(title).trim()) {
        return res.status(400).json({ message: 'Title is required' })
    }

    if (!image || !String(image).trim()) {
        return res.status(400).json({ message: 'This article has no image and cannot be imported' })
    }

    if (!url || !String(url).trim()) {
        return res.status(400).json({ message: 'Original article URL is required' })
    }

    if (!category || !String(category).trim()) {
        return res.status(400).json({ message: 'Category is required' })
    }

    if (!assignedTo) {
        return res.status(400).json({ message: 'Please assign the imported news to a writer' })
    }

    try {
        const authModel = require('../models/authModel')
        const writer = await authModel.findOne({
            _id: assignedTo,
            role: 'writer'
        }).select('name')

        if (!writer) {
            return res.status(400).json({ message: 'Selected writer was not found' })
        }

        const categoryModel = require('../models/categoryModel')
        const activeCategory = await categoryModel.findOne({
            name: String(category).trim(),
            status: 'active'
        })

        if (!activeCategory) {
            return res.status(400).json({ message: 'Selected category is not active or does not exist' })
        }

        const newsModel = require('../models/newsModel')
        const moment = require('moment')

        const cleanTitle = String(title).trim()
        const createSlug = (value) => value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        const baseSlug = createSlug(cleanTitle) || 'external-news'
        let slug = baseSlug
        let slugNumber = 2

        while (await newsModel.exists({ slug })) {
            slug = baseSlug + '-' + slugNumber
            slugNumber++
        }

        const news = await newsModel.create({
            writerId: writer._id,
            writerName: writer.name,
            title: cleanTitle,
            slug,
            image: String(image).trim(),
            category: String(category).trim(),
            description: String(description || '').trim(),
            date: moment().format('LL'),
            time: moment().format('LTS'),
            assignedTo: writer._id,
            status: 'draft',
            verificationStatus: 'pending',
            notes: 'Imported from GNews by Admin. Assigned to Writer for editing.',
            sourceType: 'gnews',
            sourceName: String(sourceName || 'GNews').trim(),
            sourceUrl: String(sourceUrl || '').trim(),
            originalUrl: String(url).trim(),
            importedBy: adminId
        })

        return res.status(201).json({
            message: 'External news imported and assigned to writer',
            news
        })
    } catch (error) {
        console.error('GNews import failed:', error.message)
        return res.status(500).json({ message: 'Failed to import external news' })
    }
}

module.exports = {
    fetchGNews,
    importGNews
}
