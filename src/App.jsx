import React from 'react'
import { Route ,Routes } from 'react-router-dom'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'

const App = () => {
  return (
    <div className=''>
      <ToastContainer/>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
 
      </Routes>
    </div>
  )
}

export default App
