import { useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './dashboard/layout/MainLayout'
import AdminIndex from './dashboard/pages/AdminIndex'
import Login from './dashboard/pages/Login'
import Signup from './dashboard/pages/Signup'
import ProtectDashboatd from './middleware/ProtectDashboatd'
import ProtectRole from './middleware/ProtectRole'
import Unable from './dashboard/pages/Unable'
import AddWriter from './dashboard/pages/AddWriter'
import Writers from './dashboard/pages/Writers'
import AddMember from './dashboard/pages/AddMember'
import Members from './dashboard/pages/Members'
import Category from './dashboard/pages/Category'
import News from './dashboard/pages/News'
import Profile from './dashboard/pages/Profile'
import WriterIndex from './dashboard/pages/WriterIndex'
import EditorIndex from './dashboard/pages/EditorIndex'
import ReporterIndex from './dashboard/pages/ReporterIndex'
import CreateNews from './dashboard/pages/CreateNews'
import storeContext from './context/storeContext'
import Edit_news from './dashboard/pages/Edit_news'
import WriterProfile from './dashboard/pages/WriterProfile'

function App() {

  const { store } = useContext(storeContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<ProtectDashboatd />} >
          <Route path='' element={<MainLayout />}>
            <Route path='' element={
              store.userInfo?.role === 'admin' ? <Navigate to='/dashboard/admin' /> :
              store.userInfo?.role === 'editor' ? <Navigate to='/dashboard/editor' /> :
              store.userInfo?.role === 'reporter' ? <Navigate to='/dashboard/reporter' /> :
              <Navigate to='/dashboard/writer' />
            } />
            <Route path='unable-access' element={<Unable />} />
            <Route path='news' element={<News />} />
            <Route path='profile' element={<Profile />} />

            <Route path='' element={<ProtectRole role='admin' />} >
              <Route path='admin' element={<AdminIndex />} />
              <Route path='writer/add' element={<AddWriter />} />
              <Route path='writers' element={<Writers />} />
              <Route path='member/add' element={<AddMember />} />
              <Route path='members' element={<Members />} />
              <Route path='member/:id' element={<WriterProfile />} />
              <Route path='writer/:id' element={<WriterProfile />} />
              <Route path='categories' element={<Category />} />
            </Route>

            <Route path='' element={<ProtectRole role='editor' />} >
              <Route path='editor' element={<EditorIndex />} />
            </Route>

            <Route path='' element={<ProtectRole role='writer' />} >
              <Route path='writer' element={<WriterIndex />} />
            </Route>

            <Route path='' element={<ProtectRole role='reporter' />} >
              <Route path='reporter' element={<ReporterIndex />} />
            </Route>

            <Route path='' element={<ProtectRole role='photographer' />} >
              <Route path='photographer' element={<ReporterIndex />} />
            </Route>

            <Route path='' element={<ProtectRole role='writerOrReporter' />} >
              <Route path='news/create' element={<CreateNews />} />
              <Route path='news/edit/:news_id' element={<Edit_news />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
