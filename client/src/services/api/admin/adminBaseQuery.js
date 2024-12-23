import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminLogout } from "@/redux/slice/adminSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken")
    
    
    if(token){
        headers.set("authorization",`Bearer ${token}`)
        
    }
    return headers
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
 
  if (result?.error && result?.error?.status === 401) {
    

    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    
    if (refreshResult?.data) {
      
      const { accessToken } = refreshResult.data;
      
     if(accessToken){
        localStorage.setItem("adminToken",accessToken)
     }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(adminLogout())
    }
  }

  return result;
};
