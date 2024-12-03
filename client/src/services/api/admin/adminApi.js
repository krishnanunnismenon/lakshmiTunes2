import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./adminBaseQuery";
import AddNewCategory from "@/pages/admin/AddNewCategory";

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
        updateProduct:builder.mutation({
            query:({id,productData})=>({
                url:`admin/products/edit-product/${id}`,
                method:"PUT",
                body:productData
            }),
            invalidatesTags: ['Products'],
        }),
        updateProductStatus: builder.mutation({
            query: ({ id, listed }) => ({
              url: `admin/products/update-status/${id}`,
              method: "PATCH",
              body: { listed }
            }),
            invalidatesTags: ["Product"],
          }),
        getUsers: builder.query({
            query:()=>({
                url:"admin/users",
                method:"GET"
            }),
            providesTags:["Users"]
        }),
        blockUser: builder.mutation({
            query:({userId,block})=>({
                url:`admin/users/${userId}/block`,
                method:'POST',
                body:{block}
            }),
            invalidatesTags:['Users']
        }),
        getCategories: builder.query({
            query:(categories)=>({
                url:'admin/categories',
                method:"GET",
                body: categories
            }),
            providesTags:["Categories"]
        }),
        toggleCategoryListing: builder.mutation({
            query:({categoryId,isListed})=>({
                url:`admin/categories/${categoryId}/toggle-listing`,
                method:"POST",
                body:{isListed}
            }),
            invalidatesTags:["Categories"]
        }),

        addCategory: builder.mutation({
            query:(data)=>({
                url:'admin/categories/add-category',
                method:"POST",
                body: data

            }),
            invalidatesTags:["Categories"]
        }),
        editCategory:builder.mutation({
            query:({categoryId,...editData})=>({
                url:`admin/categories/${categoryId}`,
                method:'PUT',
                body:editData
            }),
            invalidatesTags:['Categories']
        }),
        deleteCategory:builder.mutation({
            query:(categoryId)=>({
                url:`admin/categories/${categoryId}`,
                method:'DELETE'
            }),
            invalidatesTags:['Categories']
        }),
        
        getProductById:builder.query({
            query:(id)=>`admin/products/edit-product/${id}`,
            method:"PUT",
            providesTags: (result, error, id) => [{ type: 'Products', id }]
        })
    })
})

export const {useAdminSignInMutation, useGetProductsQuery, useAddProductsMutation
    ,useUpdateProductMutation, useUpdateProductStatusMutation,useGetUsersQuery,useBlockUserMutation,useGetProductByIdQuery
    ,  useGetCategoriesQuery,useToggleCategoryListingMutation,
useAddCategoryMutation,useEditCategoryMutation,useDeleteCategoryMutation} = adminApi;