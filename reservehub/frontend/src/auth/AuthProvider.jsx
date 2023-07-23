import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom'
import {makePostRequest} from "../api/api";
import {LOGOUT} from "../api/endpoints";



const AuthContext = createContext();
export default AuthContext;



const BASE_URL = "http://localhost:8000/reservehub_app/"
export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true)


    const navigate = useNavigate()

    const loginUser = async (values) => {

        const response = await fetch(BASE_URL + 'token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'email': values.email, 'password': values.password})
        });
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/user')
        } else {
            throw new Error('Benutzername oder Passwort ist falsch')
        }
    }

    const logoutUser = async () => {
        try {
            await makePostRequest(LOGOUT, {'acces': authTokens.access}, authTokens.access);
        } catch (e) {
            return
        }
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/login");
    }


    const updateToken = async () => {
        if (!authTokens?.refresh) {
            setLoading(false)
            return;
        }
        const response = await fetch(BASE_URL + 'token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        });
        const data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()

        }
        if (loading) {
            setLoading(false)
        }
    }


    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [authTokens, loading])


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
