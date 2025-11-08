import React, { useContext, useState } from 'react'
import { base_url } from '../../config/config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import storeContext from '../../context/storeContext'
import logo1 from '../../assets/logo1.png'

const Signup = () => {

  const navigate = useNavigate()
  const { dispatch } = useContext(storeContext)
  const [loader, setLoader] = useState(false)

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: '',
    rePassword: '',
    category: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!isStrongPassword(state.password)) {
      toast.error('Password must be strong: at least 8 characters, include uppercase, lowercase, number, and special character'.replace(/\b\w/g, l => l.toUpperCase()))
      return
    }
    if (state.password !== state.rePassword) {
      toast.error('Passwords do not match'.replace(/\b\w/g, l => l.toUpperCase()))
      return
    }
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_url}/api/signup`, {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password,
        category: state.category
      })
      setLoader(false)
      localStorage.setItem('newsToken', data.token)
      toast.success(data.message.replace(/\b\w/g, l => l.toUpperCase()))
      dispatch({
        type: "login_success",
        payload: {
          token: data.token
        }
      })
      navigate('/dashboard')
    } catch (error) {
      setLoader(false)
      toast.error(error.response.data.message.replace(/\b\w/g, l => l.toUpperCase()))
    }
  }

  return (
    <div className='min-w-screen min-h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[340px] text-slate-600 shadow-md'>
        <div className='bg-white h-full px-7 py-8 rounded-md'>
          <div className='w-full justify-center items-center flex flex-col'>
            <img className='w-[200px] mb-4' src={logo1} alt="logo1" />
            <h1 className='text-2xl font-bold text-red-500'>NEWS BULLET</h1>
          </div>
          <form onSubmit={submit} className='mt-8'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="firstName">First Name</label>
              <input value={state.firstName} required onChange={inputHandle} type="text" placeholder='First Name' name='firstName' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='firstName' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="lastName">Last Name</label>
              <input value={state.lastName} required onChange={inputHandle} type="text" placeholder='Last Name' name='lastName' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='lastName' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">Email</label>
              <input value={state.email} required onChange={inputHandle} type="email" placeholder='Email' name='email' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='email' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="category">Category</label>
              <select value={state.category} required onChange={inputHandle} name='category' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='category'>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Writer">Writer</option>
                <option value="Reporter/Photographer">Reporter/Photographer</option>
              </select>
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="password">Password</label>
              <div className='relative'>
                <input onChange={inputHandle} required value={state.password} type={showPassword ? "text" : "password"} placeholder='Password' name='password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10 w-full' id='password' />
                <span onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'>
                  {showPassword ? '👁️' : '🙈'}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="rePassword">Re-enter Password</label>
              <div className='relative'>
                <input onChange={inputHandle} required value={state.rePassword} type={showRePassword ? "text" : "password"} placeholder='Re-enter Password' name='rePassword' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10 w-full' id='rePassword' />
                <span onClick={() => setShowRePassword(!showRePassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'>
                  {showRePassword ? '👁️' : '🙈'}
                </span>
              </div>
            </div>
            <div className='mt-4'>
              <button disabled={loader} className='px-3 py-[6px] w-full bg-red-500 rounded-sm text-white hover:bg-red-600' >{loader ? "loading..." : 'Signup'}</button>
            </div>
            <div className='mt-4 text-center'>
              <p className='text-gray-600'>Already have an account? <span onClick={() => navigate('/login')} className='text-red-500 cursor-pointer hover:underline'>Login</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
