import React, { useEffect, useState, useContext } from 'react'
import { base_url } from '../../config/config'
import axios from 'axios'
import { Link } from 'react-router-dom'
import storeContext from '../../context/storeContext'
import htmlParser from 'react-html-parser'

const ReporterIndex = () => {
    const { store } = useContext(storeContext)
    const [stats, setStats] = useState({
        totalNews: 0,
        drafts: 0,
        inReview: 0,
        published: 0,
        deactive: 0
    })
    const [news, setNews] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const authConfig = {
        headers: {
            Authorization: `Bearer ${store.token}`
        }
    }

    const get_stats = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/writer/stats`, authConfig)
            setStats({
                totalNews: data.totalNews ?? 0,
                drafts: data.drafts ?? 0,
                inReview: data.inReview ?? 0,
                published: data.published ?? 0,
                deactive: data.deactive ?? 0
            })
        } catch (error) {
            console.log('Reporter stats error:', error.response?.data || error.message)
            setError(error.response?.data?.message || 'Unable to load reporter dashboard data')
        }
    }

    const get_news = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/dashboard/recent-news`, authConfig)
            setNews(Array.isArray(data.news) ? data.news.slice(0, 5) : [])
        } catch (error) {
            console.log('Reporter news error:', error.response?.data || error.message)
            setNews([])
            setError(error.response?.data?.message || 'Unable to load your news')
        } finally {
            setLoading(false)
        }
    }

    const view_news = async (id) => {
        try {
            const { data } = await axios.get(`${base_url}/api/dashboard/news/${id}`, authConfig)
            const description = data.news?.description || ''
            setSelectedNews({
                ...data.news,
                description: description.replace(/\n/g, '<br>')
            })
            setViewModal(true)
        } catch (error) {
            console.log('Reporter news details error:', error.response?.data || error.message)
        }
    }

    useEffect(() => {
        if (store.token) {
            get_stats()
            get_news()
        }
    }, [store.token])

    const getStatusClass = (status) => {
        if (status === 'published') return 'bg-green-100 text-green-800'
        if (status === 'submitted') return 'bg-blue-100 text-blue-800'
        if (status === 'reviewed_by_writer') return 'bg-purple-100 text-purple-800'
        if (status === 'reviewed_by_editor') return 'bg-indigo-100 text-indigo-800'
        if (status === 'rework_needed') return 'bg-orange-100 text-orange-800'
        if (status === 'draft') return 'bg-gray-100 text-gray-800'
        if (status === 'deactive') return 'bg-red-100 text-red-800'
        return 'bg-yellow-100 text-yellow-800'
    }

    const formatStatus = (status) => {
        if (!status) return 'Unknown'
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <div className='mt-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
                    <span className='text-xl font-bold'>{stats.totalNews}</span>
                    <span className='text-md'>Total News</span>
                </div>
                <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
                    <span className='text-xl font-bold'>{stats.drafts}</span>
                    <span className='text-md'>Drafts</span>
                </div>
                <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
                    <span className='text-xl font-bold'>{stats.inReview}</span>
                    <span className='text-md'>In Review</span>
                </div>
                <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
                    <span className='text-xl font-bold'>{stats.published}</span>
                    <span className='text-md'>Published</span>
                </div>
            </div>

            <div className='bg-white p-4 rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h2 className='text-xl font-semibold text-slate-700'>My News</h2>
                        <p className='text-sm text-gray-500 mt-1'>News created by you using photographer images</p>
                    </div>
                    <Link to='/dashboard/news/create' className='px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600'>
                        Create News
                    </Link>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm'>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className='text-center py-8 text-gray-500'>Loading your news...</div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {news.map((n) => (
                                <div key={n._id} className='border border-gray-200 rounded-md p-4 cursor-pointer hover:shadow-md transition' onClick={() => view_news(n._id)}>
                                    {n.image && (
                                        <img className='w-full h-32 object-cover rounded-md mb-2' src={n.image} alt={n.title || 'News'} />
                                    )}
                                    <h3 className='text-lg font-semibold text-slate-700 mb-1'>{n.title || 'Untitled'}</h3>
                                    <p className='text-sm text-gray-600 mb-2 break-words'>
                                        {(n.description || '').replace(/<[^>]*>/g, '').slice(0, 100)}
                                        {(n.description || '').length > 100 ? '...' : ''}
                                    </p>
                                    <div className='flex justify-between items-center gap-2'>
                                        <span className={`px-2 py-1 text-xs rounded ${getStatusClass(n.status)}`}>
                                            {formatStatus(n.status)}
                                        </span>
                                        <span className='text-xs text-gray-500'>{n.date || ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {news.length === 0 && (
                            <div className='text-center py-8'>
                                <p className='text-gray-500'>No news created yet.</p>
                                <Link to='/dashboard/news/create' className='inline-block mt-3 px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600'>
                                    Create Your First News
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {viewModal && selectedNews && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto overflow-x-hidden p-6'>
                        <div className='flex justify-between items-center border-b pb-4'>
                            <h2 className='text-xl font-bold text-gray-800'>News Details</h2>
                            <button
                                onClick={() => setViewModal(false)}
                                className='text-gray-500 hover:text-gray-700 text-2xl'
                            >
                                &times;
                            </button>
                        </div>
                        <div className='flex flex-col gap-y-5 mt-5'>
                            {selectedNews.image && (
                                <img src={selectedNews.image} alt={selectedNews.title} className='w-full h-64 object-cover rounded' />
                            )}
                            <div className='flex flex-col gap-y-4'>
                                <h3 className='text-red-700 uppercase font-medium text-xl'>{selectedNews.category}</h3>
                                <h2 className='text-3xl text-gray-700 font-bold'>{selectedNews.title}</h2>
                                <div className='flex gap-x-2 text-xs font-normal text-slate-600'>
                                    <span>{selectedNews.date}</span>
                                    <span>{selectedNews.reporterName || selectedNews.writerName || 'Reporter'}</span>
                                </div>
                                <div className='text-gray-700 leading-relaxed prose prose-sm max-w-none break-words'>
                                    {htmlParser(selectedNews.description || '')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReporterIndex
