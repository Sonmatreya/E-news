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

module.exports = {
    fetchGNews
}
