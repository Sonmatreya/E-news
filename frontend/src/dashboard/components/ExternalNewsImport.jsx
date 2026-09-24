import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import storeContext from '../../context/storeContext'
import { base_url } from '../../config/config'

const ExternalNewsImport = () => {
    const { store } = useContext(storeContext)
    const [articles, setArticles] = useState([])
    const [writers, setWriters] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState('')

    const loadData = async () => {
        try {
            setLoading(true)

            const [newsResponse, writersResponse, categoriesResponse] = await Promise.all([
                axios.get(`${base_url}/api/external-news?category=general&country=in&lang=en&max=6`),
                axios.get(`${base_url}/api/news/writers`, {
                    headers: { Authorization: `Bearer ${store.token}` }
                }),
                axios.get(`${base_url}/api/categories/active`)
            ])

            setArticles(newsResponse.data.articles || [])
            setWriters(writersResponse.data.writers || [])
            setCategories(categoriesResponse.data.categories || [])
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to load external news')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (store?.token && store?.userInfo?.role === 'admin') {
            loadData()
        }
    }, [store?.token])

    const [assignments, setAssignments] = useState({})

    const getAssignment = (article) => {
        const saved = assignments[article.url] || {}
        return {
            writer: saved.writer || writers[0]?._id || '',
            category: saved.category || categories[0]?.name || ''
        }
    }

    const setAssignment = (url, field, value) => {
        setAssignments(prev => ({
            ...prev,
            [url]: {
                ...getAssignment({ url }),
                ...prev[url],
                [field]: value
            }
        }))
    }

    const importArticle = async (article) => {
        const assignment = getAssignment(article)

        if (!assignment.writer) {
            toast.error('Please add at least one writer first')
            return
        }

        if (!assignment.category) {
            toast.error('Please add an active category first')
            return
        }

        try {
            setImporting(article.url)

            const { data } = await axios.post(
                `${base_url}/api/external-news/import`,
                {
                    title: article.title,
                    description: article.description || article.content || '',
                    image: article.image,
                    url: article.url,
                    sourceName: article.source?.name || 'GNews',
                    sourceUrl: article.source?.url || '',
                    category: assignment.category,
                    assignedTo: assignment.writer
                },
                {
                    headers: { Authorization: `Bearer ${store.token}` }
                }
            )

            toast.success(data.message)
            setArticles(prev => prev.filter(item => item.url !== article.url))
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to import article')
        } finally {
            setImporting('')
        }
    }

    if (store?.userInfo?.role !== 'admin') {
        return null
    }

    return (
        <section className='mb-6 bg-white border border-slate-200 rounded-lg shadow-sm'>
            <div className='px-5 py-4 border-b flex flex-wrap items-center justify-between gap-2'>
                <div>
                    <h2 className='text-lg font-bold text-slate-800'>Import External News</h2>
                    <p className='text-xs text-slate-500 mt-1'>Select a GNews article, assign it to a writer, and send it through your normal workflow.</p>
                </div>
                <span className='text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600'>GNews • Admin Only</span>
            </div>

            {loading ? (
                <div className='p-6 text-sm text-slate-500'>Loading external news...</div>
            ) : articles.length === 0 ? (
                <div className='p-6 text-sm text-slate-500'>No external articles available right now.</div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4'>
                    {articles.map((article, index) => {
                        const assignment = getAssignment(article)

                        return (
                            <div key={article.url || index} className='border border-slate-200 rounded-lg overflow-hidden bg-slate-50'>
                                <div className='flex gap-4 p-4'>
                                    {article.image ? (
                                        <img src={article.image} alt='' className='w-28 h-24 object-cover rounded-md flex-shrink-0' />
                                    ) : (
                                        <div className='w-28 h-24 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500 flex-shrink-0'>No image</div>
                                    )}

                                    <div className='min-w-0'>
                                        <p className='text-xs font-semibold text-red-600'>{article.source?.name || 'External source'}</p>
                                        <h3 className='font-semibold text-sm text-slate-800 line-clamp-3 mt-1'>{article.title}</h3>
                                        <p className='text-xs text-slate-500 mt-2 line-clamp-2'>{article.description || 'No description available.'}</p>
                                    </div>
                                </div>

                                <div className='px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <select
                                        value={assignment.writer}
                                        onChange={e => setAssignment(article.url, 'writer', e.target.value)}
                                        className='px-3 py-2 text-sm rounded-md border border-slate-300 bg-white outline-none'
                                    >
                                        <option value=''>Assign Writer</option>
                                        {writers.map(writer => (
                                            <option key={writer._id} value={writer._id}>{writer.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={assignment.category}
                                        onChange={e => setAssignment(article.url, 'category', e.target.value)}
                                        className='px-3 py-2 text-sm rounded-md border border-slate-300 bg-white outline-none'
                                    >
                                        <option value=''>Select Category</option>
                                        {categories.map(category => (
                                            <option key={category._id || category.name} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>

                                    <button
                                        type='button'
                                        disabled={importing === article.url}
                                        onClick={() => importArticle(article)}
                                        className='sm:col-span-2 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60'
                                    >
                                        {importing === article.url ? 'Importing...' : 'Import to E-News →'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default ExternalNewsImport
