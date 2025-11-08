import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { base_url } from '../../config/config'
import axios from 'axios'
import storeContext from '../../context/storeContext'

const WriterProfile = () => {
    const { id } = useParams()
    const { store } = useContext(storeContext)
    const [writer, setWriter] = useState(null)
    const [loading, setLoading] = useState(true)

    const get_writer = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/news/writer/${id}`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            setWriter(data.writer)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        get_writer()
    }, [id])

    if (loading) {
        return <div className='flex justify-center items-center h-screen'>Loading...</div>
    }

    if (!writer) {
        return <div className='flex justify-center items-center h-screen'>Writer not found</div>
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-semibold text-slate-700 mb-6'>Writer Profile</h1>
            <div className='bg-white p-6 rounded-md shadow-md'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <img className='w-32 h-32 rounded-full object-cover mb-4' src={writer.image || "https://res.cloudinary.com/dpj4vsqbo/image/upload/v1696952625/news/g7ihrhbxqdg5luzxtd9y.webp"} alt="Profile" />
                        <h2 className='text-xl font-medium text-slate-700'>{writer.name}</h2>
                        <p className='text-gray-600'>{writer.role}</p>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Email</label>
                            <p className='text-slate-700'>{writer.email}</p>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Category</label>
                            <p className='text-slate-700'>{writer.category}</p>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Employee ID</label>
                            <p className='text-slate-700'>{writer.employeeId || 'N/A'}</p>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Joined</label>
                            <p className='text-slate-700'>{new Date(writer.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WriterProfile
