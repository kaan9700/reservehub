import './App.css'
import NavBar from "./components/NavBar.jsx";
import {Route, Routes} from "react-router-dom";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import PrivateRoutes from './components/PrivateRoutes.jsx'
import {useContext} from "react";
import AuthContext from "./auth/AuthProvider.jsx";
import Superadmin from "./views/userComponents/Superadmin.jsx";
import Admin from "./views/userComponents/Admin.jsx";
import User from "./views/userComponents/User.jsx";
import Test from "./components/Test.jsx";
import AppFooter from "./components/Footer.jsx";
import Home from "./views/Home.jsx";
import About from "./views/About.jsx";
import Services from "./views/Services.jsx";
import ServiceInfo from "./views/ServiceInfo.jsx";
import BuyView from "./views/BuyView.jsx";
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
                <Route path="/service/:id" element={<ServiceInfo />} />
                <Route path="/buy/:id" element={<BuyView />} />


                <Route path='/user' element={<PrivateRoutes/>}>

                    <Route element={
                        user && user.role === 'admin' ? <Superadmin/> :
                        user && user.role === 'superadmin' ? <Admin/> :
                        <User/>
                                    } path='/user'/>
                </Route>
            </Routes>
        <AppFooter />
        </>
    )
}

export default App
