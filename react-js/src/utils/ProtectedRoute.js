import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// custom component to redirect user to login page if there's no user object in AuthContext component i.e, user is not authenticated
const ProtectedRoute = () => {
    let {user} = useContext(AuthContext);
    return (!user ? <Navigate to='/login'/> : <Outlet />)
}

export default ProtectedRoute;