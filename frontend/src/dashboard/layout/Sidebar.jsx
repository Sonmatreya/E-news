import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiFillDashboard, AiOutlinePlus } from 'react-icons/ai'
import { ImProfile } from 'react-icons/im'
import { BiNews } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { FaPlus } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import storeContext from '../../context/storeContext'
import { IoLogOutOutline } from "react-icons/io5";
import toast from 'react-hot-toast'


const Sidebar = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { store, dispatch } = useContext(storeContext)

    const logout = () => {
        localStorage.removeItem('mewsToken')
        dispatch({ type: 'logout', payload: '' })
        toast.success('Logout successfully'.replace(/\b\w/g, l => l.toUpperCase()))
        navigate('/login')
    }
    return (
        <div className='w-[250px] h-screen fixed left-0 top-0 bg-white'>
            <div className='h-[160px] flex justify-center items-center'>
                <Link to='/'>
                    <img className='w-[200px] h-auto' src="/logo1.png" alt="logo1" />
                </Link>
            </div>
            <ul className='px-3 flex flex-col gap-y-1 font-medium'>
                {
                    store.userInfo?.role === 'admin' ? <>
                        <li>
                            <Link to='/dashboard/admin' className={`px-3 ${pathname === '/dashboard/admin' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/member/add' className={`px-3 ${pathname === '/dashboard/member/add' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiOutlinePlus /></span>
                                <span>Add Member</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/members' className={`px-3 ${pathname === '/dashboard/members' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><FiUsers /></span>
                                <span>Members</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/categories' className={`px-3 ${pathname === '/dashboard/categories' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><MdCategory /></span>
                                <span>Categories</span>
                            </Link>
                        </li>
                    </> : store.userInfo?.role === 'editor' ? <>
                        <li>
                            <Link to='/dashboard/editor' className={`px-3 ${pathname === '/dashboard/editor' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    </> : store.userInfo?.role === 'reporter' ? <>
                        <li>
                            <Link to='/dashboard/reporter' className={`px-3 ${pathname === '/dashboard/reporter' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/news/create' className={`px-3 ${pathname === '/dashboard/news/create' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><FaPlus /></span>
                                <span>Add News</span>
                            </Link>
                        </li>
                    </> : store.userInfo?.role === 'writer' ? <>
                        <li>
                            <Link to='/dashboard/writer' className={`px-3 ${pathname === '/dashboard/writer' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    </> : store.userInfo?.role === 'photographer' ? <>
                        <li>
                            <Link to='/dashboard/photographer' className={`px-3 ${pathname === '/dashboard/photographer' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/news/create' className={`px-3 ${pathname === '/dashboard/news/create' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><FaPlus /></span>
                                <span>Add News</span>
                            </Link>
                        </li>
                    </> : <>
                        <li>
                            <Link to='/dashboard/reporter' className={`px-3 ${pathname === '/dashboard/reporter' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><AiFillDashboard /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/news/create' className={`px-3 ${pathname === '/dashboard/news/create' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                                <span className='text-xl'><FaPlus /></span>
                                <span>Add News</span>
                            </Link>
                        </li>
                    </>
                }

                <li>
                    <Link to='/dashboard/news' className={`px-3 ${pathname === '/dashboard/news' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                        <span className='text-xl'><BiNews /></span>
                        <span>News</span>
                    </Link>
                </li>

                <li>
                    <Link to='/dashboard/profile' className={`px-3 ${pathname === '/dashboard/profile' ? 'bg-red-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white`}>
                        <span className='text-xl'><ImProfile /></span>
                        <span>Profile</span>
                    </Link>
                </li>

                <li>
                    <div onClick={logout} className={`px-3  py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white cursor-pointer`}>
                        <span className='text-xl'><IoLogOutOutline /></span>
                        <span>Logout</span>
                    </div>
                </li>

            </ul>
        </div>
    )
}

export default Sidebar