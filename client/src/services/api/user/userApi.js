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
        }),
        getUserProfile: builder.query({
            query:()=>({
                url:"user/profileDetails",
                method:"GET"
            }),
            providesTags:['Profile']
        }),
        updateProfile: builder.mutation({
            query:(userData)=>({
                url:"user/update-profile",
                method:'PUT',
                body:userData
            }),
            invalidatesTags:['Profile']
        }),
        sendOtp: builder.mutation({
            query: (email) => ({
                url: "user/send-otp",
                method: "POST",
                body: { email }
            })
        }),
        verifyOtp: builder.mutation({
            query: ({ email, otp }) => ({
                url: "user/verify-otp",
                method: "POST",
                body: { email, otp }
            })
        }),
        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: "user/change-password",
                method: "PUT",
                body: passwordData
            })
        }),
        getOrders: builder.query({
            query: () => ({
                url: "user/orders",
                method: "GET"
            })
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `user/cancel-order/${orderId}`,
                method: "PUT"
            })
        }),
        getUserAddress:builder.query({
            query:()=>({
                url:'user/addresses',
                method:"GET"
            }),
            providesTags:['Address'],
        }),
        addUserAddress:builder.mutation({
            query:(address)=>({
            url:'user/addresses',
            method:"POST",
            body:address
            }),
            invalidatesTags:['Address']
            
        }),
        updatePrimaryAddress:builder.mutation({
            query:(addressId)=>({
                url:`user/addresses/${addressId}/primary`,
                method:"PUT"
            }),
            invalidatesTags:['Address']
        })

    })
})

export const {useUserHomeQuery,useGetUserProfileQuery,useUpdateProfileMutation,useSendOtpMutation,
    useVerifyOtpMutation,useChangePasswordMutation,useGetOrdersQuery,useCancelOrderMutation,
    useGetUserAddressQuery,useAddUserAddressMutation,useUpdatePrimaryAddressMutation
} = userApi