import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryUser";
import { data } from "autoprefixer";


export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (formData) => ({
        url: "auth/signup",
        method: "POST",
        body: formData,
      }),
    }),
    verifyOTP: builder.mutation({
      query:({email,otpValue})=>({
        url:"auth/verify-otp",
        method:'POST',
        body:{email,otpValue}
      })
    }),
    resendOTP: builder.mutation({
      query:({email})=>({
        url:"auth/resend-otp",
        method:'POST',
        body:{email}
      })
    }),
    forgotPass: builder.mutation({
      query:(data)=>({
        url:"auth/verify-email",
        method:"POST",
        body:{email:data.email}
      })
    }),
    verifyForgotPass:builder.mutation({
      query:({email,otp})=>({
        url:"auth/veify-emailOTP",
        method:"POST",
        body:{email,otp}
      })
    }),
    resendForgotPassOtp:builder.mutation({
      query:(data)=>({
        url:"auth/resend-forgotPass-otp",
        method:"POST",
        body:{email:data.email}
      })
    }),
    signIn: builder.mutation({
      query:(credentials)=>({
        url:"auth/signin",
        method:'POST',
        body: credentials
      })
    }),
    googleAuth: builder.mutation({
      query:(credentials)=>({
        url:'auth/googleLogin',
        method:"POST",
        body:credentials
      })
    })
  }),
    
});

export const { useSignUpMutation ,useVerifyOTPMutation, useResendOTPMutation, useSignInMutation,useGoogleAuthMutation, useForgotPassMutation, useVerifyForgotPassMutation, useResendForgotPassOtpMutation} = authApi;
