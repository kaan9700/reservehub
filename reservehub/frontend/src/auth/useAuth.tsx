import { useContext } from "react";
import AuthContext from "./AuthProvider";

interface Auth {
    isAuthenticated: boolean;  
    user: object | null;         
    acces: string | null;
}


interface AuthContextProps {
    auth: Auth;
    setAuth: () => {},
}

const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export default useAuth;
