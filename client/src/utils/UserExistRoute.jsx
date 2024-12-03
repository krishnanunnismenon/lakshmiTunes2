import { Navigate, Outlet } from "react-router-dom"

export  function UserExistRoute(){
    const token = localStorage.getItem('userToken')
    if(token){
        return <Outlet/>
    }

    return <Navigate to='/login' replace/>
}