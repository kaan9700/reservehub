import { useState } from 'react'
import './App.css'
import NavBar from "./components/NavBar.jsx";
import {Route, Routes} from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";

function App() {


  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/register' element={ <Register />} />
        <Route path='/login' element={ <Login />} />
      </Routes>
    </>
  )
}

export default App
