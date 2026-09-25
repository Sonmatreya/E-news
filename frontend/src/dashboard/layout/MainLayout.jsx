import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'
import socket, { connectSocket, disconnectSocket } from '../../socket'

const MainLayout = () => {
    useEffect(() => {
        connectSocket()

        const handleNewsEvent = (payload) => {
            window.dispatchEvent(new CustomEvent('e-news:realtime', { detail: payload }))
        }

        const handleCreated = (payload) => {
            handleNewsEvent(payload)
            toast.success('New news activity received')
        }

        const handleUpdated = (payload) => {
            handleNewsEvent(payload)
            toast('News content updated')
        }

        const handleStatus = (payload) => {
            handleNewsEvent(payload)
            toast('News workflow status updated')
        }

        const handleDeleted = (payload) => {
            handleNewsEvent(payload)
            toast('News deleted')
        }

        socket.on('news:created', handleCreated)
        socket.on('news:updated', handleUpdated)
        socket.on('news:status', handleStatus)
        socket.on('news:deleted', handleDeleted)

        return () => {
            socket.off('news:created', handleCreated)
            socket.off('news:updated', handleUpdated)
            socket.off('news:status', handleStatus)
            socket.off('news:deleted', handleDeleted)
            disconnectSocket()
        }
    }, [])

    return (
        <div className='min-w-screen min-h-screen bg-slate-100'>
            <Sidebar />
            <div className='ml-[250px] w-[calc(100vw-268px)] min-h-[100vh]'>
                <Header />
                <div className='p-4'>
                    <div className='pt-[85px]'>
                        <Outlet />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MainLayout