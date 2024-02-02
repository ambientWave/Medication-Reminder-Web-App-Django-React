import axios from "axios"; /* axios library is imported because we would
take advantage of interceptors. In this way, any http request made across
react app is going to be intercepted first to make token check */
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs"; // dayjs is superior to momentjs
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const endpointRelativePath = "/api/"

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useContext(AuthContext)

    // modify the headers of any request going from the component that imports useAxios component
    const axiosInstance = axios.create({
        endpointRelativePath,
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    axiosInstance.interceptors.request.use(async request => {
        const user = jwtDecode(authTokens.access);
        const isNotExpired = dayjs.unix(user.exp).diff(dayjs()) < 1 // if expiration unix timestamp (ms) of access token is different from current timestamp by 1 ms then it's expired

        // the request with modified headers
        if (isNotExpired) return request

        const response = await axios.post(`${endpointRelativePath}token/refresh/`, {
            refresh: authTokens.refresh
        })
        localStorage.setItem("authTokens", JSON.stringify(response.data))
        setAuthTokens(response.data)
        setUser(jwtDecode(response.data.access))
        
        // modify the headers of any request going from the component that imports useAxios component
        request.headers.Authorization = `Bearer ${response.data.access}`

        return request
    })

    return axiosInstance
}

export default useAxios;