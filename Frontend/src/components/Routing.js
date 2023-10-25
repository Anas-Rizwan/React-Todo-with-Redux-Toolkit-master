import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
// import Login from './Login/Login'
// import SignUp from './SignUp/SignUp'
import TodoList from './Todo/TodoList'

export const Routing = () => {

  const [login, setlogin] = useState()
  useEffect(() => {
    setlogin(window.localStorage.getItem('isloggedin'))
  }, [])

  return (
    <Routes>
      <Route exact path='/' element={login ? <TodoList /> : <Home />} />
      <Route path='/Home' element={<Home />} />
      {/* <Route path='/Login' element={<Login />} />
      <Route path='/SignUp' element={<SignUp />} /> */}
      <Route path='/TodoList' element={<TodoList />} />
    </Routes >
  )
}
