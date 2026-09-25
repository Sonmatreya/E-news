import React, { useContext, useEffect, useState } from 'react'
import { MdCloudUpload } from 'react-icons/md'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'

const PhotographerUpload = () => {
    const { store } = useContext(storeContext)
    const [images, setImages] = useState([])
    const [caption, setCaption] = useState('')
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [loader, setLoader] = useState(false)

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

    const chooseFiles = (e) => {
        const selected = Array.from(e.target.files || [])
        setFiles(selected)
        setPreviews(selected.map(file => URL.createObjectURL(file)))
    }

    const uploadImages = async (e) => {
        e.preventDefault()

        if (!files.length) {
            toast.error('Please select at least one image')
            return
        }

        const formData = new FormData()
        files.forEach(file => formData.append('images', file))
        formData.append('caption', caption)

        try {
            setLoader(true)

            const { data } = await axios.post(`${base_url}/api/images/add`, formData, {
                headers: { Authorization: `Bearer ${store.token}` }
            })

            toast.success(data.message)
            setFiles([])
            setPreviews([])
            setCaption('')
            await getImages()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Image upload failed')
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='bg-white rounded-md p-5'>
                <h2 className='text-xl font-semibold text-slate-700'>Photo Uploads</h2>
                <p className='text-gray-500 mt-1'>Upload newsroom photographs that reporters can select while creating news.</p>
            </div>

            <div className='bg-white rounded-md p-5'>
                <h3 className='text-lg font-semibold mb-4'>Upload News Images</h3>

                <form onSubmit={uploadImages}>
                    <label htmlFor='photographer-images'
                        className='w-full min-h-[220px] border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer'>
                        {previews.length ? (
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-3 w-full'>
                                {previews.map((src, index) => (
                                    <img key={index} src={src} className='w-full h-32 object-cover rounded' alt='preview' />
                                ))}
                            </div>
                        ) : (
                            <>
                                <MdCloudUpload className='text-4xl text-gray-500' />
                                <span className='text-gray-500 mt-2'>Select image(s)</span>
                            </>
                        )}
                    </label>

                    <input
                        id='photographer-images'
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={chooseFiles}
                        className='hidden'
                    />

                    <input
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder='Photo caption / description (optional)'
                        className='w-full mt-4 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-red-500'
                    />

                    <button
                        disabled={loader}
                        className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60'>
                        {loader ? 'Uploading...' : 'Upload Images'}
                    </button>
                </form>
            </div>

            <div className='bg-white rounded-md p-5'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>My Submitted Images</h3>
                    <span className='text-sm text-gray-500'>{images.length} image(s)</span>
                </div>

                {images.length === 0 ? (
                    <p className='text-gray-500 py-6 text-center'>No images uploaded yet.</p>
                ) : (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {images.map(image => (
                            <div key={image._id} className='border rounded-md overflow-hidden'>
                                <img src={image.url} className='w-full h-36 object-cover' alt='news' />
                                <div className='p-2'>
                                    <p className='text-xs text-gray-500'>{image.caption || 'No caption'}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${image.status === 'used' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                        {image.status === 'used' ? 'Used by Reporter' : 'Available to Reporter'}
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

export default PhotographerUpload
