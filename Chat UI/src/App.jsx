import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './Container/Register'
import Profile from './Container/Profile'
import { Route, Routes } from "react-router";
import Login from './Container/Login'
import Home from './Container/Home'
import Protectedroutes from './Container/ProtectedRoute/Protected'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/' element={<Protectedroutes />} >
          <Route path='/' element={<Home />} />
          {/* <Route path='/chat' element={<Home />} /> */}
        </Route>

      </Routes>
    </>
  )
}

export default App
