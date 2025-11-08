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

    const get_stats = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/writer/stats`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            setStats(data)
        } catch (error) {
            console.log(error)
        }
    }

    const get_news = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/dashboard/recent-news`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            setNews(data.news.slice(0, 5)) // Show latest 5 news
        } catch (error) {
            console.log(error)
        }
    }

    const view_news = async (id) => {
        try {
            const { data } = await axios.get(`${base_url}/api/news/${id}`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            // Convert newlines to HTML breaks for proper display
            const newsWithFormattedDescription = {
                ...data.news,
                description: data.news.description.replace(/\n/g, '<br>')
            }
            setSelectedNews(newsWithFormattedDescription)
            setViewModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_stats()
        get_news()
    }, [])

    return (
        <div className='mt-2'>
            <div className='grid grid-cols-4 gap-x-4 mb-6'>
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
                    <h2 className='text-xl font-semibold text-slate-700'>My News</h2>
                    <Link to='/dashboard/news' className='px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600'>View All</Link>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {news.map((n, i) => (
                        <div key={i} className='border border-gray-200 rounded-md p-4 cursor-pointer' onClick={() => view_news(n._id)}>
                            <img className='w-full h-32 object-top rounded-md mb-2' src={n.image} alt={n.title} />
                            <h3 className='text-lg font-semibold text-slate-700 mb-1'>{n.title}</h3>
                            <p className='text-sm text-gray-600 mb-2 break-words' dangerouslySetInnerHTML={{ __html: n.description.slice(0, 100) + '...' }}></p>
                            <div className='flex justify-between items-center'>
                                <span className={`px-2 py-1 text-xs rounded ${n.status === 'published' ? 'bg-green-100 text-green-800' : n.status === 'review' ? 'bg-blue-100 text-blue-800' : n.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {n.status.replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                                <span className='text-xs text-gray-500'>{n.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {news.length === 0 && (
                    <div className='text-center py-8'>
                        <p className='text-gray-500'>No news available. Create your first news article.</p>
                    </div>
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
                        <div className='flex flex-col gap-y-5'>
                            <img src={selectedNews.image} alt={selectedNews.title} className='w-full h-64 object-top rounded' />
                            <div className='flex flex-col gap-y-4'>
                                <h3 className='text-red-700 uppercase font-medium text-xl'>{selectedNews.category}</h3>
                                <h2 className='text-3xl text-gray-700 font-bold'>{selectedNews.title}</h2>
                                <div className='flex gap-x-2 text-xs font-normal text-slate-600'>
                                    <span>{selectedNews.date}/</span>
                                    <span>{selectedNews.writerName}</span>
                                </div>
                                <div className='text-gray-700 leading-relaxed prose prose-sm max-w-none break-words'>
                                    {htmlParser(selectedNews.description)}
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
