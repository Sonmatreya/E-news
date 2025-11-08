'use client'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { FaFacebookF } from 'react-icons/fa'
import { AiFillYoutube, AiOutlineTwitter } from 'react-icons/ai'
import bg_header from '../assets/header-bg.jpg'
import logo from '../assets/logo1.png'
import adver_image from '../assets/s.png'
import Image from 'next/image'
import Header_Category from './Header_Category'

const Header = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('LLLL'))

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(moment().format('LLLL'))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div>
            {/* Top Bar */}
            <div className='px-5 lg:px-8 flex justify-between items-center bg-[#940b0b] text-[#cccccc]'>
                <div className='flex items-center gap-2'>
                    {/* LIVE dot */}
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    <span className='font-semibold text-white text-[13px]'>LIVE</span>
                    <span className='text-[13px] font-medium ml-2'>{currentTime}</span>
                </div>

                <div className='flex gap-x-[1px]'>
                    <a className='w-[37px] h-[35px] flex justify-center items-center bg-[#f80a0af2]' href=""><FaFacebookF /></a>
                    <a className='w-[37px] h-[35px] flex justify-center items-center bg-[#f80a0af2]' href=""><AiOutlineTwitter /></a>
                    <a className='w-[37px] h-[35px] flex justify-center items-center bg-[#f80a0af2]' href=""><AiFillYoutube /></a>
                </div>
            </div>

            {/* Header Bg Section */}
            <div style={{ backgroundImage: `url(${bg_header.src})`, backgroundSize: 'cover' }}>
                <div className="px-8 py-14">
                    <div className='flex justify-between items-start'>

                        {/* Logo Left */}
                        <div className='md:w-4/12 w-full flex justify-center md:justify-start'>
                            <Image className='w-[250px] h-[150px]' alt='logo' src={logo} />
                        </div>

                        {/* Advertisement Right (circle fixed 180px) */}
                        <div className='md:w-8/12 w-full hidden md:flex justify-end'>
                            <Image
                                src={adver_image}
                                alt="advertisement"
                                width={690}
                                height={180}
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>

                    </div>
                </div>
            </div>

            <Header_Category />
        </div>
    )
}

export default Header
