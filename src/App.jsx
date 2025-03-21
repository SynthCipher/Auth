import React from 'react'
import { Route ,Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import EmailVerify from './pages/EmailVerify.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login.jsx'

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
