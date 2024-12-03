import { Navigate, Outlet } from "react-router-dom"

export  function UserProtectRoute(){
    const token = localStorage.getItem('userToken')
    if(!token){
        return <Outlet/>
    }

    return <Navigate to='/home' replace/>
}