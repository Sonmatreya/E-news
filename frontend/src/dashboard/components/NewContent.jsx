import React, { useContext, useState, useEffect } from 'react'
import { FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'
import htmlParser from 'react-html-parser'

const NewContent = () => {

    const { store } = useContext(storeContext)
    const [news, setNews] = useState([])
    const [all_news, set_all_news] = useState([])

    const [parPage, setParPage] = useState(5)
    const [pages, setPages] = useState(0)
    const [page, setPage] = useState(1)



    const get_news = async () => {

        try {
            const { data } = await axios.get(`${base_url}/api/news`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            set_all_news(data.news)
            setNews(data.news)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_news()
    }, [])

    useEffect(() => {
        if (news.length > 0) {
            const calculate_page = Math.ceil(news.length / parPage)
            setPages(calculate_page)
        }
    }, [news, parPage])

    const type_filter = (e) => {
        if (e.target.value === '') {
            setNews(all_news)
            setPage(1)
            setParPage(5)
        } else {
            const tempNews = all_news.filter(n => n.status === e.target.value || n.verificationStatus === e.target.value)
            setNews(tempNews)
            setPage(1)
            setParPage(5)
        }

    }

    const serach_news = (e) => {

        const tempNews = all_news.filter(n => n.title.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
        setNews(tempNews)
        setPage(1)
        setParPage(5)
    }
    const [res, set_res] = useState({
        id: '',
        loader: false
    })

    const [viewModal, setViewModal] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)

    const [rejectModal, setRejectModal] = useState(false)
    const [rejectNewsId, setRejectNewsId] = useState('')
    const [rejectReason, setRejectReason] = useState('')

    const delete_news = async (news_id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                const { data } = await axios.delete(`${base_url}/api/news/${news_id}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                })
                toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
                get_news()
            } catch (error) {
                console.log(error)
                toast.error((error.response?.data?.message || 'Failed to delete news').replace(/\b\w/g, l => l.toUpperCase()))
            }
        }
    }

    const update_news_status = async (news_id, status) => {
        try {
            const { data } = await axios.put(`${base_url}/api/news/status-update/${news_id}`, { status }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
            get_news()
        } catch (error) {
            console.log(error)
            toast.error((error.response?.data?.message || 'Failed to update status').replace(/\b\w/g, l => l.toUpperCase()))
        }
    }
    const update_status = async (status, news_id, verificationNotes = '') => {
        try {
            set_res(
                {
                    id: news_id,
                    loader: true
                }
            )
            const { data } = await axios.put(`${base_url}/api/news/status-update/${news_id}`, { status, verificationNotes }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            set_res({
                id: '',
                loader: false
            })
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
            get_news()
        } catch (error) {
            set_res({
                id: '',
                loader: false
            })
            console.log(error)
            toast.error(error.response.data.message.replace(/\b\w/g, l => l.toUpperCase()))
        }
    }

    const view_news = async (id) => {
        try {
            const { data } = await axios.get(`${base_url}/api/news/${id}`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            // Convert newlines to HTML paragraphs for proper display
            const newsWithFormattedDescription = {
                ...data.news,
                description: `<p>${data.news.description.replace(/\n/g, '</p><p>')}</p>`
            }
            setSelectedNews(newsWithFormattedDescription)
            setViewModal(true)
        } catch (error) {
            console.log(error)
            toast.error('Failed to load news details'.replace(/\b\w/g, l => l.toUpperCase()))
        }
    }

    const openRejectModal = (id) => {
        setRejectNewsId(id);
        setRejectModal(true);
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            set_res({ id: rejectNewsId, loader: true });
            const { data } = await axios.put(`${base_url}/api/news/status-update/${rejectNewsId}`, {
                status: 'rejected',
                verificationNotes: rejectReason
            }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            });
            set_res({ id: '', loader: false });
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()));
            setRejectModal(false);
            setRejectReason('');
            setRejectNewsId('');
            get_news();
        } catch (error) {
            set_res({ id: '', loader: false });
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to reject news');
        }
    };

    return (
        <div>
            <div className='px-4 py-3 flex gap-x-3'>
                <select onChange={type_filter} name="type_filter" className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id="type_filter">
                    <option value="">---select status---</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="reviewed_by_writer">Reviewed by Writer</option>
                    <option value="reviewed_by_editor">Reviewed by Editor</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                    <option value="deactive">Deactive</option>
                    <option value="rework_needed">Rework Needed</option>
                </select>
                <input onChange={serach_news} type="text" placeholder='search news' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='search_news' name='search_news' />
            </div>
            <div className='relative overflow-x-auto p-4'>
                <table className='w-full text-sm text-left text-slate-600'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        <tr>
                            <th className='px-7 py-3'>No</th>
                            <th className='px-7 py-3'>Image</th>
                            <th className='px-7 py-3'>Title</th>
                            <th className='px-7 py-3'>Category</th>
                            <th className='px-7 py-3'>Status</th>
                            <th className='px-7 py-3'>Verification</th>
                            <th className='px-7 py-3'>Notes</th>
                            <th className='px-7 py-3'>Date</th>
                            <th className='px-7 py-3'>Action</th>
                            <th className='px-7 py-3'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            news.length > 0 && news.slice((page - 1) * parPage, page * parPage).map((n, i) => <tr key={i} className='bg-white border-b cursor-pointer' onClick={() => view_news(n._id)}>
                                <td className='px-6 py-4'>{i + 1}</td>
                                <td className='px-6 py-4'>
                                    <img className='w-[40px] h-[40px]' src={n.image} alt="" />
                                </td>
                                <td className='px-6 py-4'>{n.title.slice(0, 15)}...</td>
                                <td className='px-6 py-4'>{n.category}</td>
                                <td className='px-6 py-4'>
                                    <span className={`px-2 py-1 text-xs rounded ${n.status === 'draft' ? 'bg-blue-100 text-blue-800' : n.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : n.status === 'reviewed_by_writer' ? 'bg-purple-100 text-purple-800' : n.status === 'reviewed_by_editor' ? 'bg-indigo-100 text-indigo-800' : n.status === 'published' ? 'bg-green-100 text-green-800' : n.status === 'rejected' ? 'bg-red-100 text-red-800' : n.status === 'rework_needed' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {n.status.replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className={`px-2 py-1 text-xs rounded ${n.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : n.verificationStatus === 'under review' ? 'bg-blue-100 text-blue-800' : n.verificationStatus === 'verified_by_writer' ? 'bg-purple-100 text-purple-800' : n.verificationStatus === 'verified_by_editor' ? 'bg-indigo-100 text-indigo-800' : n.verificationStatus === 'final' ? 'bg-green-100 text-green-800' : n.verificationStatus === 'rework_needed' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {n.verificationStatus.replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>{n.notes || 'N/A'}</td>
                                <td className='px-6 py-4'>{n.date}</td>
                                <td className='px-6 py-4'>
                                    <div className='flex justify-start items-center gap-x-4 text-slate-600'>
                                        {
                                            store?.userInfo?.role === 'admin' ? <>
                                                {
                                                    n.status === 'reviewed_by_editor' && <span onClick={(e) => { e.stopPropagation(); update_status('published', n._id, 'Published by Admin') }} className='px-2 py-[2px] bg-blue-100 text-blue-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Publish'}</span>
                                                }
                                                {
                                                    n.status === 'published' && <span onClick={(e) => { e.stopPropagation(); update_status('deactive', n._id, 'Deactivated by Admin') }} className='px-2 py-[2px] bg-green-100 text-green-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Deactivate'}</span>
                                                }
                                                {
                                                    n.status === 'deactive' && <span onClick={(e) => { e.stopPropagation(); update_status('published', n._id, 'Republished by Admin') }} className='px-2 py-[2px] bg-red-100 text-red-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Republish'}</span>
                                                }
                                                {
                                                    (n.status === 'reviewed_by_editor' || n.status === 'published' || n.status === 'deactive') && <span onClick={(e) => { e.stopPropagation(); openRejectModal(n._id) }} className='px-2 py-[2px] bg-red-100 text-red-800 rounded-lg text-xs cursor-pointer ml-1' >{res.loader && res.id === n._id ? 'Loading...' : 'Reject'}</span>
                                                }
                                            </> : store?.userInfo?.role === 'editor' ? <>
                                                {
                                                    n.status === 'reviewed_by_writer' && <span onClick={(e) => { e.stopPropagation(); update_status('reviewed_by_editor', n._id, 'Reviewed by Editor') }} className='px-2 py-[2px] bg-blue-100 text-blue-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Submit'}</span>
                                                }
                                                {
                                                    n.status === 'rework_needed' && n.returnTo === 'editor' && <span onClick={(e) => { e.stopPropagation(); update_status('reviewed_by_editor', n._id, 'Reworked by Editor') }} className='px-2 py-[2px] bg-yellow-100 text-yellow-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Rework'}</span>
                                                }

                                                {
                                                    (n.status === 'reviewed_by_writer' || n.status === 'rework_needed') && <span onClick={(e) => { e.stopPropagation(); openRejectModal(n._id) }} className='px-2 py-[2px] bg-red-100 text-red-800 rounded-lg text-xs cursor-pointer ml-1' >{res.loader && res.id === n._id ? 'Loading...' : 'Reject'}</span>
                                                }
                                            </> : store?.userInfo?.role === 'writer' ? <>
                                                {
                                                    n.status === 'draft' && <span onClick={(e) => { e.stopPropagation(); update_status('submitted', n._id, 'Submitted by Writer') }} className='px-2 py-[2px] bg-gray-100 text-gray-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Submit'}</span>
                                                }
                                                {
                                                    n.status === 'submitted' && <span onClick={(e) => { e.stopPropagation(); update_status('reviewed_by_writer', n._id, 'Submitted to Editor by Writer') }} className='px-2 py-[2px] bg-blue-100 text-blue-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Submit to Editor'}</span>
                                                }
                                                {
                                                    n.status === 'rework_needed' && n.returnTo === 'writer' && <span onClick={(e) => { e.stopPropagation(); update_status('reviewed_by_writer', n._id, 'Resubmitted by Writer') }} className='px-2 py-[2px] bg-yellow-100 text-yellow-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Resubmit'}</span>
                                                }

                                            </> : (store?.userInfo?.role === 'reporter' || store?.userInfo?.role === 'photographer') ? <>
                                                {
                                                    n.status === 'draft' && <span onClick={(e) => { e.stopPropagation(); update_status('submitted', n._id, 'Submitted for review') }} className='px-2 py-[2px] bg-gray-100 text-gray-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Submit to Writer'}</span>
                                                }
                                                {
                                                    n.status === 'rework_needed' && n.returnTo === store?.userInfo?.role && <span onClick={(e) => { e.stopPropagation(); update_status('submitted', n._id, 'Resubmitted after rework') }} className='px-2 py-[2px] bg-yellow-100 text-yellow-800 rounded-lg text-xs cursor-pointer' >{res.loader && res.id === n._id ? 'Loading...' : 'Resubmit'}</span>
                                                }
                                            </> : <span className='px-2 py-[2px] bg-gray-100 text-gray-800 rounded-lg text-xs' >View Only</span>
                                        }
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex justify-start items-center gap-x-4 text-white'>
                                        <div onClick={(e) => { e.stopPropagation(); view_news(n._id) }} className='p-[6px] bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50 cursor-pointer'><FaEye /></div>
                                        {
                                            store?.userInfo?.role === 'writer' && <>
                                                <Link to={`/dashboard/news/edit/${n._id}`} onClick={(e) => e.stopPropagation()} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                                <div onClick={(e) => { e.stopPropagation(); delete_news(n._id) }} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer'><FaTrash /></div>
                                            </>
                                        }
                                        {
                                            (store?.userInfo?.role === 'reporter' || store?.userInfo?.role === 'photographer') && <>
                                                <Link to={`/dashboard/news/edit/${n._id}`} onClick={(e) => e.stopPropagation()} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                                <div onClick={(e) => { e.stopPropagation(); delete_news(n._id) }} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer'><FaTrash /></div>
                                            </>
                                        }
                                        {
                                            store?.userInfo?.role === 'admin' && (
                                                <>
                                                    <div onClick={(e) => { e.stopPropagation(); delete_news(n._id) }} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer mr-1'><FaTrash /></div>
                                                    {n.status === 'published' && (
                                                        <div onClick={(e) => { e.stopPropagation(); update_status('deactive', n._id, 'Deactivated by Admin') }} className='p-[6px] bg-orange-500 rounded hover:shadow-lg hover:shadow-orange-500/50 cursor-pointer'><FaTimes /></div>
                                                    )}
                                                </>
                                            )
                                        }
                                        {
                                            store?.userInfo?.role === 'editor' && (
                                                <>
                                                    <div onClick={(e) => { e.stopPropagation(); delete_news(n._id) }} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer mr-1'><FaTrash /></div>
                                                </>
                                            )
                                        }
                                    </div>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
            <div className='flex items-center justify-end px-10 gap-x-3 text-slate-600'>
                <div className='flex gap-x-3 justify-center items-center'>
                    <p className='px-4 py-3 font-semibold text-sm'>News par Page</p>
                    <select value={parPage} onChange={(e) => {
                        setParPage(parseInt(e.target.value))
                        setPage(1)
                    }} name='par_page' id='par_page' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <p className='px-6 py-3 font-semibold text-sm'>
                    {(page - 1) * parPage + 1}/{news.length} - of {pages}
                </p>
                <div className='flex items-center gap-x-3'>
                    <IoIosArrowBack onClick={() => {
                        if (page > 1) setPage(page - 1)
                    }} className='w-5 h-5 cursor-pointer' />
                    <IoIosArrowForward onClick={() => {
                        if (page < pages) setPage(page + 1)
                    }} className='w-5 h-5 cursor-pointer' />
                </div>
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

            {rejectModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6'>
                        <div className='flex justify-between items-center border-b pb-4'>
                            <h2 className='text-xl font-bold text-gray-800'>Reject News</h2>
                            <button
                                onClick={() => setRejectModal(false)}
                                className='text-gray-500 hover:text-gray-700 text-2xl'
                            >
                                &times;
                            </button>
                        </div>
                        <div className='mt-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Reason for Rejection</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                rows="4"
                                placeholder="Please provide a detailed reason for rejecting this news..."
                            />
                        </div>
                        <div className='flex justify-end gap-3 mt-6'>
                            <button
                                onClick={() => setRejectModal(false)}
                                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={res.loader}
                                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50'
                            >
                                {res.loader ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewContent
