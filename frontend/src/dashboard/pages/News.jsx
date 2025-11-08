import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import NewContent from '../components/NewContent'
import storeContext from '../../context/storeContext'

const News = () => {

    const { store } = useContext(storeContext)
    return (
        <div className='bg-white rounded-md'>
            <div className='flex justify-between p-4'>
                <h2 className='text-xl font-medium'>News</h2>
                {
                    store.userInfo && (store.userInfo.role === 'writer' || store.userInfo.role === 'reporter' || store.userInfo.role === 'photographer') && <Link className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600' to='/dashboard/news/create'>Create News</Link>
                }

            </div>
            <NewContent />
        </div>
    )
}

export default News