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
        }),
        updateUserAddress: builder.mutation({
            query:({id,...address})=>({
                url:`user/addresses/${id}`,
                method:'PUT',
                body:address
            }),
            invalidatesTags:['Address']
        }),
        deleteUserAddress:builder.mutation({
            query:(id)=>({
                url:`user/addresses/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:['Address']
        })

    })
})

export const {useUserHomeQuery,useGetUserProfileQuery,useUpdateProfileMutation,useSendOtpMutation,
    useVerifyOtpMutation,useChangePasswordMutation,
    useGetUserAddressQuery,useAddUserAddressMutation,useUpdatePrimaryAddressMutation,useUpdateUserAddressMutation,useDeleteUserAddressMutation
} = userApi