import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdCloudUpload } from 'react-icons/md'
import JoditEditor from 'jodit-react'
import Galler from '../components/Galler'
import { base_url } from '../../config/config'
import axios from 'axios'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'

const CreateNews = () => {
    const { store } = useContext(storeContext)
    const editor = useRef(null)

    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [loader, setLoader] = useState(false)

    const get_images = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/images`, {
                headers: { Authorization: `Bearer ${store.token}` }
            })
            setImages(data.images || [])
        } catch (error) {
            console.log(error)
        }
    }

    const get_categories = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/categories/active`)
            setCategories(data.categories || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_images()
        get_categories()
    }, [])

    const selectImage = (image) => {
        setSelectedImage(image)
        setShow(false)
    }

    const added = async (e) => {
        e.preventDefault()

        if (!selectedImage) {
            toast.error('Please select an image uploaded by a photographer')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('category', selectedCategory)
        formData.append('imageUrl', selectedImage.url)
        formData.append('galleryImageId', selectedImage._id)

        try {
            setLoader(true)
            const { data } = await axios.post(`${base_url}/api/news/add`, formData, {
                headers: { Authorization: `Bearer ${store.token}` }
            })
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
            setTitle('')
            setDescription('')
            setSelectedCategory('')
            setSelectedImage(null)
        } catch (error) {
            toast.error((error.response?.data?.message || 'Something went wrong').replace(/\b\w/g, l => l.toUpperCase()))
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className='bg-white rounded-md'>
            <div className='flex justify-between p-4'>
                <h2 className='text-xl font-medium'>Create News</h2>
                <Link className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600' to='/dashboard/news'>News</Link>
            </div>

            <div className='p-4'>
                <form onSubmit={added}>
                    <div className='flex flex-col gap-y-2 mb-6'>
                        <label className='text-md font-medium text-gray-600'>Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} type='text'
                            placeholder='News title'
                            className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                        <select required value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md'>
                            <option value=''>Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-6'>
                        <div className='flex justify-between items-center mb-2'>
                            <label className='text-sm font-medium text-gray-700'>Photographer Image</label>
                            <button type='button' onClick={() => setShow(true)}
                                className='px-3 py-2 bg-gray-800 text-white rounded'>
                                Select From Photographer Gallery
                            </button>
                        </div>

                        <div className='border-2 border-dashed rounded p-3 min-h-[240px] flex items-center justify-center'>
                            {selectedImage ? (
                                <div className='w-full'>
                                    <img src={selectedImage.url} className='w-full h-64 object-contain rounded' alt='Selected photographer image' />
                                    <p className='text-sm text-gray-600 mt-2'>
                                        Photographer: {selectedImage.photographerName || 'Unknown'}
                                    </p>
                                    {selectedImage.caption && <p className='text-sm text-gray-500'>{selectedImage.caption}</p>}
                                </div>
                            ) : (
                                <div className='text-center text-gray-500'>
                                    <MdCloudUpload className='text-3xl mx-auto' />
                                    <p>Select an image from the photographer gallery</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-2 mb-6'>
                        <h2>Description</h2>
                        <JoditEditor
                            ref={editor}
                            value={description}
                            tabIndex={1}
                            onBlur={value => setDescription(value)}
                            onChange={() => {}}
                        />
                    </div>

                    <button disabled={loader} className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600'>
                        {loader ? 'Creating...' : 'Create News'}
                    </button>
                </form>
            </div>

            {show && <Galler setShow={setShow} images={images} onSelect={selectImage} />}
        </div>
    )
}

export default CreateNews
