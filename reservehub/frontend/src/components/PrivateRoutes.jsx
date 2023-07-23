import { Outlet, Navigate } from 'react-router-dom'
import useAuth from "../auth/useAuth.jsx";
import {useContext} from "react";
import AuthContext from "../auth/AuthProvider.jsx";
const PrivateRoutes = () => {
    const {user} = useContext(AuthContext)
    return(
        user ? <Outlet /> : <Navigate to={"/login"} />
    )
}

export default PrivateRoutes