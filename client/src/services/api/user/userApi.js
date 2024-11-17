import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryUser";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,
    endpoints:(builder)=>({
        userHome:builder.query({
            query:()=>({
                url:"user/home",
                method:"GET"
            })
        })
    })
})

export const {useUserHomeQuery} = userApi