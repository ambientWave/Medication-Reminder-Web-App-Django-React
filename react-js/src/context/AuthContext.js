import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    /* this hook is to track the token pair of the current logged user across the entire react app. The
    default behaviour is hardcoded to interact with local storage in the browser and fetch the item named 'authTokens'
    if present */
    const [authTokens, setAuthTokens] = useState(() => {
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    })

    /* this hook to track the logged user in the current session across the entire react app. The
    default behaviour is hardcoded to interact with local storage in the browser and fetch the item named 'authTokens'
    if present, and decode using jwt_decode (mostlty involves base64 decoding) to extract readable string */
    const [user, setUser] = useState(() => {
        localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
    })

    // to disable the login buttons, etc when user submit credentials so he/she can't submit repetitive times
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    // obtain token pair during the login process
    const loginUser = async (email, password) => {
        const response = await fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()

        if(response.status === 200){
            // login process is successful
            setAuthTokens(data)
            setUser(jwt_decode(data.access)) // the access token (not the refresh token) which is a base64 string that contains user profile info
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("/")


        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    // submit registeration info to the its respective endpoint and navigate to login path
    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })

        if(response.status === 201){ // http status code for a created resource
            navigate("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
        swal.fire({
            title: "You have been logged out",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }

    /* Every time your component renders, 
    React will update the screen and then run 
    the code inside useEffect. In other words,
    useEffect "delays" a piece of code from
    running until that render is reflected 
    on the screen. */
    // this hook runs implicitly, every single time of the component render, because variables in the dependency list are changed
    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}> {/* this prop will allow access to auth data wherever this component is imported in the app */}
            {/* children prop would contain all children elements in the main app and
            it's allowed to be present if the loading hook is equal to false 
            info defined in here and would pass */}
            {loading ? null : children}
        </AuthContext.Provider>
    )

}