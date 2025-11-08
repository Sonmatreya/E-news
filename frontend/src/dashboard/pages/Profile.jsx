import React, { useContext, useState } from 'react'
import { FaImage } from "react-icons/fa6";
import storeContext from '../../context/storeContext';
import { base_url } from '../../config/config';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { store, dispatch } = useContext(storeContext);
    const [loader, setLoader] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [state, setState] = useState({
        old_password: '',
        new_password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const { data } = await axios.post(`${base_url}/api/change-password`, state, {
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });
            setLoader(false);
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()));
            setState({
                old_password: '',
                new_password: ''
            });
        } catch (error) {
            setLoader(false);
            toast.error((error.response?.data?.message || 'Something went wrong').replace(/\b\w/g, l => l.toUpperCase()));
        }
    };

    const imageHandle = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            setImageLoader(true);
            const { data } = await axios.post(`${base_url}/api/update-profile-image`, formData, {
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });
            setImageLoader(false);
            toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()));
            dispatch({
                type: 'update_profile_image',
                payload: {
                    image: data.image
                }
            });
        } catch (error) {
            setImageLoader(false);
            toast.error((error.response?.data?.message || 'Something went wrong').replace(/\b\w/g, l => l.toUpperCase()));
        }
    };

    return (
        <div className='w-full grid grid-cols-2 gap-x-6 mt-5'>
            <div className='bg-white gap-x-3 p-6 rounded flex justify-center items-center'>
                <div>
                    <label htmlFor="img" className={`w-[150px] h-[150px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed ${imageLoader ? 'opacity-50' : ''}`}>
                        <div className='flex justify-center items-center flex-col gap-y-2'>
                            {store.userInfo?.image ? (
                                <img src={store.userInfo.image} alt="Profile" className='w-full h-full object-cover rounded' />
                            ) : (
                                <>
                                    <span className='text-2xl'><FaImage /></span>
                                    <span>Select Image</span>
                                </>
                            )}
                        </div>
                    </label>
                    <input onChange={imageHandle} className='hidden' type="file" id='img' name='img' accept='image/*' />
                </div>
                <div className='text-[#404040] flex flex-col gap-y-1 justify-center items-start'>
                    <span>Name : {store.userInfo?.name || 'N/A'}</span>
                    <span>Email : {store.userInfo?.email || 'N/A'}</span>
                    <span>Category : {store.userInfo?.category || 'N/A'}</span>
                    <span>Employee ID : {store.userInfo?.employeeId || 'N/A'}</span>
                </div>
            </div>
            <div className='bg-white px-6 py-4 text-[#404040]'>
                <h2 className='pb-3 text-center'>Change password</h2>

                <form onSubmit={submit}>
                    <div className='grid grid-cols-1 gap-y-5 mb-3'>
                        <div className='flex flex-col gap-y-2'>
                            <div className='flex flex-col gap-y-2'>
                                <label className='text-md font-medium text-gray-600' htmlFor="old_password">Old Password</label>
                                <input value={state.old_password} onChange={inputHandle} type="password" placeholder='old password' name='old_password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='old_password' required />
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='flex flex-col gap-y-2'>
                                <label className='text-md font-medium text-gray-600' htmlFor="new_password">New Password</label>
                                <input value={state.new_password} onChange={inputHandle} type="password" placeholder='new password' name='new_password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='new_password' required />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button disabled={loader} className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600' >{loader ? 'Changing...' : 'Change Password'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile