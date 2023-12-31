import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom'
import {makeRequest} from "../api/api";
import {LOGOUT, DELETE_ACCOUNT} from "../api/endpoints";
import Notifications from "../components/Notifications.jsx";


const AuthContext = createContext();
export default AuthContext;


const BASE_URL = "http://localhost:8000/reservehub_app/"
export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true)


    const navigate = useNavigate()

    const loginUser = async (values, redirectTo) => {

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
            navigate(redirectTo || '/user')
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
    let data = await response.json();

    if (response.status === 200) {
        const refreshToken = authTokens?.refresh;
        const newToken = {'refresh': refreshToken, 'access': data.access};

        // Extract the updated user data from the server response
        const updatedUser = data.user;

        // Get the previous role from localStorage
        const previousRole = localStorage.getItem('userRole');

        // Check if the role has changed and log it
        if (updatedUser.role && previousRole && updatedUser.role !== previousRole) {
           Notifications('success', {'message': 'Rolle geändert', 'description': `Dein Account wurde zu ${updatedUser.role} geändert`})
        }

        // Save the updated role to localStorage for future reference
        localStorage.setItem('userRole', updatedUser.role);

        // Update the local state with the new user data and tokens
        setUser(updatedUser);
        setAuthTokens(newToken);

        // Update the local storage with the new token data
        localStorage.setItem('authTokens', JSON.stringify(newToken));
    } else {
        logoutUser();
    }

    if (loading) {
        setLoading(false);
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
        deleteAccount: deleteAccount,
    }


    useEffect(() => {
        if (!authTokens) {
            setLoading(false)
            return
        }
        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 0.25 // 15 Sekunden

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
