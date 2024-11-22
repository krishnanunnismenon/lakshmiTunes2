import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


export function AdminProtectedRoute({allowedRoute}){
    const {role,isAuthenticated} = useSelector((state)=>state.admin);
    const token = localStorage.getItem("adminToken");

    if(!token || !isAuthenticated){
       
        return <Navigate to="/admin/sign-in" replace/>
    }
    
    if(allowedRoute && !allowedRoute.includes(role)){
        
        return <Navigate to="/admin/sign-in" replace/>
    }

    return <Outlet/>
}