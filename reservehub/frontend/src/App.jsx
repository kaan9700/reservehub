import './App.css'
import NavBar from "./components/NavBar.jsx";
import {Route, Routes} from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import PrivateRoutes from './components/PrivateRoutes.jsx'
import {useContext} from "react";
import AuthContext from "./auth/AuthProvider.jsx";
import Superadmin from "./components/userComponents/Superadmin.jsx";
import Admin from "./components/userComponents/Admin.jsx";
import User from "./components/userComponents/User.jsx";
import Test from "./components/Test.jsx";
import AppFooter from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";

function App() {
    const {user} = useContext(AuthContext)


    return (
        <>
            <NavBar/>
            <Routes>
                <Route path='/test' element={<Test />} />
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/services' element={<Services/>}/>

                <Route path='/user' element={<PrivateRoutes/>}>

                    <Route element={
                        user && user.role === 'superadmin' ? <Superadmin/> :
                        user && user.role === 'admin' ? <Admin/> :
                        <User/>
                                    } path='/user'/>
                </Route>
            </Routes>
        <AppFooter />
        </>
    )
}

export default App
