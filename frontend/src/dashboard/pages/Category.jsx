import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'
import toast from 'react-hot-toast'

const Category = () => {

    const { store } = useContext(storeContext)
    const [categories, setCategories] = useState([])
    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [updateName, setUpdateName] = useState('')
    const [updateDescription, setUpdateDescription] = useState('')
    const [updateId, setUpdateId] = useState('')

    const get_categories = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/categories/admin`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            setCategories(data.categories)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_categories()
    }, [])

    const add_category = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${base_url}/api/categories`, {
                name,
                description
            }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
            setName('')
            setDescription('')
            setShow(false)
            get_categories()
        } catch (error) {
            toast.error(error.response.data.message.replace(/\b\w/g, l => l.toUpperCase()))
        }
    }

    const update_category = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`${base_url}/api/categories/${updateId}`, {
                name: updateName,
                description: updateDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            })
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
            setUpdateName('')
            setUpdateDescription('')
            setUpdateId('')
            get_categories()
        } catch (error) {
            toast.error(error.response.data.message.replace(/\b\w/g, l => l.toUpperCase()))
        }
    }

    const delete_category = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const { data } = await axios.delete(`${base_url}/api/categories/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                })
                toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
                get_categories()
            } catch (error) {
                toast.error(error.response.data.message.replace(/\b\w/g, l => l.toUpperCase()))
            }
        }
    }

    return (
        <div className='bg-white rounded-md'>
            <div className='flex justify-between p-4'>
                <h2 className='text-xl font-medium'>Categories</h2>
                <button onClick={() => setShow(true)} className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600'>Add Category</button>
            </div>

            {/* Add Category Modal */}
            {show && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-md w-96'>
                        <h3 className='text-lg font-medium mb-4'>Add New Category</h3>
                        <form onSubmit={add_category}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Category Name</label>
                                <input
                                    type='text'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Enter category name'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Enter category description'
                                    rows='3'
                                />
                            </div>
                            <div className='flex justify-end gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setShow(false)}
                                    className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600'
                                >
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Category Modal */}
            {updateId && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-md w-96'>
                        <h3 className='text-lg font-medium mb-4'>Update Category</h3>
                        <form onSubmit={update_category}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Category Name</label>
                                <input
                                    type='text'
                                    value={updateName}
                                    onChange={(e) => setUpdateName(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Enter category name'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                                <textarea
                                    value={updateDescription}
                                    onChange={(e) => setUpdateDescription(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Enter category description'
                                    rows='3'
                                />
                            </div>
                            <div className='flex justify-end gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setUpdateId('')}
                                    className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600'
                                >
                                    Update Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='relative overflow-x-auto p-4'>
                <table className='w-full text-sm text-left text-slate-600'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        <tr>
                            <th className='px-7 py-3'>No</th>
                            <th className='px-7 py-3'>Name</th>
                            <th className='px-7 py-3'>Category</th>
                            <th className='px-7 py-3'>Description</th>
                            <th className='px-7 py-3'>Status</th>
                            <th className='px-7 py-3'>Created</th>
                            <th className='px-7 py-3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map((category, i) => <tr key={i} className='bg-white border-b'>
                                <td className='px-6 py-4'>{i + 1}</td>
                                <td className='px-6 py-4 font-medium'>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                                <td className='px-6 py-4'>{category.slug.charAt(0).toUpperCase() + category.slug.slice(1)}</td>
                                <td className='px-6 py-4'>{category.description || 'No description'}</td>
                                <td className='px-6 py-4'>
                                    <span className={`px-2 py-[2px] rounded-lg text-xs ${
                                        category.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>{new Date(category.createdAt).toLocaleDateString()}</td>
                                <td className='px-6 py-4'>
                                    <div className='flex justify-start items-center gap-x-4 text-white'>
                                        <button
                                            onClick={() => {
                                                setUpdateId(category._id)
                                                setUpdateName(category.name)
                                                setUpdateDescription(category.description || '')
                                            }}
                                            className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => delete_category(category._id)}
                                            className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Category
