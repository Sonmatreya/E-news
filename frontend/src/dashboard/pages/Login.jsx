import React, { useContext, useState } from 'react'
import { base_url } from '../../config/config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import storeContext from '../../context/storeContext'
import logo1 from '../../assets/logo1.png'

const Login = () => {

  const navigate = useNavigate()
  const { dispatch } = useContext(storeContext)
  const [loader, setLoader] = useState(false)

  const [state, setState] = useState({
    email: "",
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)


  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_url}/api/login`, state)
      setLoader(false)
      localStorage.setItem('newsToken', data.token)
      toast.success('Login successfully'.replace(/\b\w/g, l => l.toUpperCase()))
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
        <div className='bg-white h-full px-7 py-8 rounded-md flex flex-col items-center'>
          <div className='flex flex-col justify-center items-center mb-8'>
            <img className='w-[200px] mb-4' src={logo1} alt="logo1" />
            <h1 className='text-2xl font-bold text-red-500'>NEWS BULLET</h1>
          </div>
          <form onSubmit={submit} className='w-full'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">Email</label>
              <input value={state.email} required onChange={inputHandle} type="email" placeholder='email' name='email' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10' id='email' />
            </div>
            <div className='flex flex-col gap-y-2'>
              <div className='flex flex-col gap-y-2'>
                <label className='text-md font-medium text-gray-600' htmlFor="password">Password</label>
                <div className='relative'>
                  <input onChange={inputHandle} required value={state.password} type={showPassword ? "text" : "password"} placeholder='password' name='password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-red-500 h-10 w-full' id='password' />
                  <span onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'>
                    {showPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <button disabled={loader} className='px-3 py-[6px] w-full bg-red-500 rounded-sm text-white hover:bg-red-600' >{loader ? "loading..." : ' Login'}</button>
            </div>
            <div className='mt-4 text-center'>
              <p className='text-gray-600'>Don't have an account? <span onClick={() => navigate('/signup')} className='text-red-500 cursor-pointer hover:underline'>Create Account</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login