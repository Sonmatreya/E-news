import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { base_url } from '../../config/config'
import storeContext from '../../context/storeContext'


const Members = () => {

  const { store } = useContext(storeContext)
  const [members, setMembers] = useState([])

  const get_members = async () => {
    try {

      const { data } = await axios.get(`${base_url}/api/news/staff`, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      setMembers(data.staff)
    } catch (error) {
      console.log(error)
    }
  }

  const delete_member = async (id) => {
    try {
      await axios.delete(`${base_url}/api/news/member/${id}`, {
        headers: {
          'Authorization': `Bearer ${store.token}`
        }
      })
      get_members()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_members()
  }, [])
  return (
    <div className='bg-white rounded-md'>
      <div className='flex justify-between p-4'>
        <h2 className='text-xl font-medium'>Members</h2>
        <Link className='px-3 py-[6px] bg-red-500 rounded-sm text-white hover:bg-red-600' to='/dashboard/member/add'>Add Member</Link>
      </div>
      <div className='relative overflow-x-auto p-4'>
        <table className='w-full text-sm text-left text-slate-600'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-7 py-3'>No</th>
              <th className='px-7 py-3'>Name</th>
              <th className='px-7 py-3'>Category</th>
              <th className='px-7 py-3'>Role</th>
              <th className='px-7 py-3'>Image</th>
              <th className='px-7 py-3'>Email</th>
              <th className='px-7 py-3'>Active</th>
            </tr>
          </thead>
          <tbody>
            {
              members.map((r, i) => <tr key={i} className='bg-white border-b' >
                <td className='px-6 py-4'>{i + 1}</td>
                <td className='px-6 py-4'>{r.name}</td>
                <td className='px-6 py-4'>{r.category}</td>
                <td className='px-6 py-4'>{r.role.charAt(0).toUpperCase() + r.role.slice(1)}</td>
                <td className='px-6 py-4'>
                  <img className='w-[40px] h-[40px] rounded-full' src={r.image || "https://res.cloudinary.com/dpj4vsqbo/image/upload/v1696952625/news/g7ihrhbxqdg5luzxtd9y.webp"} alt="" />
                </td>
                <td className='px-6 py-4'>{r.email}</td>
                <td className='px-6 py-4'>
                  <div className='flex justify-start items-center gap-x-4 text-white'>
                    <Link to={`/dashboard/member/${r._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                    <button onClick={() => delete_member(r._id)} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><FaTrash /></button>
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

export default Members
