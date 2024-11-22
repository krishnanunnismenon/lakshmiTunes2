import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./adminBaseQuery";

export const adminApi = createApi({
    reducerPath:"adminApi",
    baseQuery: baseQueryWithReauth,
    endpoints:(builder)=>({
        adminSignIn: builder.mutation({
            query:(credentials)=>({
                url:"/auth/admin/signin",
                method:"POST",
                body:credentials
            }),
            invalidatesTags: ["Product"],
        }),
        getProducts: builder.query({
            query:()=>({
                url: "admin/products/all-products",
                method:"GET",
                
            }),
            providesTags: ["Product"],
        }),
        addProducts: builder.mutation({
            
            query:(productData)=>({
                url:"admin/products/add-product",
                method:"POST",
                body:productData
            })
                 
        }),
        updateProductStatus: builder.mutation({
            query: ({ id, listed }) => ({
              url: `admin/products/update-status/${id}`,
              method: "PATCH",
              body: { listed }
            }),
            invalidatesTags: ["Product"],
          }),

    })
})

export const {useAdminSignInMutation, useGetProductsQuery, useAddProductsMutation, useUpdateProductStatusMutation} = adminApi;