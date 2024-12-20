import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminLogout } from "@/redux/slice/adminSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken")
    console.log(token)
    
    if(token){
        headers.set("authorization",`Bearer ${token}`)
        
    }
    return headers
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result)
 
  if (result?.error && result?.error?.status === 401) {
    

    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    console.log("refresh", refreshResult);
    console.log(refreshResult)
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
