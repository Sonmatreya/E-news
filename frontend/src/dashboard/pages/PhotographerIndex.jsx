import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import { Link } from 'react-router-dom'
import { MdCloudUpload, MdPhotoLibrary } from 'react-icons/md'

const PhotographerIndex = () => {
    const { store } = useContext(storeContext)
    const [images, setImages] = useState([])

    const getImages = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/images`, {
                headers: { Authorization: `Bearer ${store.token}` }
            })
            setImages(data.images || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getImages()
    }, [])

    const available = images.filter(image => image.status !== 'used').length
    const used = images.filter(image => image.status === 'used').length

    return (
        <div className='space-y-6'>
            <div className='bg-white rounded-md p-5'>
                <h2 className='text-xl font-semibold text-slate-700'>Photographer Dashboard</h2>
                <p className='text-gray-500 mt-1'>Manage your newsroom photographs and see which images are being used by reporters.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='bg-white rounded-md p-5 border-l-4 border-red-500'>
                    <p className='text-sm text-gray-500'>Total Photos</p>
                    <h3 className='text-3xl font-bold text-slate-700 mt-2'>{images.length}</h3>
                </div>

                <div className='bg-white rounded-md p-5 border-l-4 border-green-500'>
                    <p className='text-sm text-gray-500'>Available to Reporter</p>
                    <h3 className='text-3xl font-bold text-green-600 mt-2'>{available}</h3>
                </div>

                <div className='bg-white rounded-md p-5 border-l-4 border-gray-500'>
                    <p className='text-sm text-gray-500'>Used by Reporter</p>
                    <h3 className='text-3xl font-bold text-gray-600 mt-2'>{used}</h3>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Link to='/dashboard/photographer/upload'
                    className='bg-red-500 hover:bg-red-600 text-white rounded-md p-6 flex items-center gap-4'>
                    <MdCloudUpload className='text-4xl' />
                    <div>
                        <h3 className='text-lg font-semibold'>Upload Photos</h3>
                        <p className='text-sm opacity-90'>Upload new newsroom images for reporters.</p>
                    </div>
                </Link>

                <div className='bg-white rounded-md p-6 flex items-center gap-4'>
                    <MdPhotoLibrary className='text-4xl text-red-500' />
                    <div>
                        <h3 className='text-lg font-semibold text-slate-700'>Photo Library</h3>
                        <p className='text-sm text-gray-500'>Your uploaded photos are shown below.</p>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-md p-5'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>Recent Photos</h3>
                    <Link to='/dashboard/photographer/upload' className='text-sm text-red-500 hover:text-red-600'>
                        Upload Photos
                    </Link>
                </div>

                {images.length === 0 ? (
                    <p className='text-gray-500 py-6 text-center'>No images uploaded yet.</p>
                ) : (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {images.slice(0, 8).map(image => (
                            <div key={image._id} className='border rounded-md overflow-hidden'>
                                <img src={image.url} className='w-full h-32 object-cover' alt='news' />
                                <div className='p-2'>
                                    <p className='text-xs text-gray-500 truncate'>{image.caption || 'No caption'}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${image.status === 'used' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                        {image.status === 'used' ? 'Used by Reporter' : 'Available'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PhotographerIndex
