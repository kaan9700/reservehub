import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom'
import {makeRequest} from "../api/api";
import {LOGOUT, DELETE_ACCOUNT} from "../api/endpoints";


const AuthContext = createContext();
export default AuthContext;


const BASE_URL = "http://localhost:8000/reservehub_app/"
export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true)


    const navigate = useNavigate()

    const loginUser = async (values) => {

        const response = await fetch(BASE_URL + 'login/', {
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
            throw new Error(data.message)
        }
    }

    const logoutUser = async () => {
        try {
            await makeRequest('POST', LOGOUT, {'access': authTokens.access});
        } catch (e) {
            return
        }
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/login");
    }


    const updateToken = async () => {
        const response = await fetch(BASE_URL + 'token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        });
        let data = await response.json()

        if (response.status === 200) {
            const refreshToken = authTokens?.refresh
            const newToken = {'refresh': refreshToken, 'access': data.access}
            setAuthTokens(newToken)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(newToken))
        } else {
            logoutUser()

        }
        if (loading) {
            setLoading(false)
        }
    }


    const deleteAccount = async () => {
        try {
            const del_response = await makeRequest('POST', DELETE_ACCOUNT, {}, authTokens.access);
            console.log(del_response)
            return del_response
            // logoutUser(); // Benutzer ausloggen und Token entfernen, nachdem das Konto gelöscht wurde
        } catch (e) {
            console.error("Fehler beim Löschen des Kontos:", e.message);
        }

    }




    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        deleteAccount: deleteAccount
    }


    useEffect(() => {
        if (!authTokens) {
            setLoading(false)
            return
        }
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
