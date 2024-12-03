import { userApi } from "./userApi";

const productApi = userApi.injectEndpoints({
    endpoints:(builder)=>({
        getNewProducts: builder.query({
            query:()=>({
                url:"user/products/new",
                method:"GET"
            })
        }),
        getAllProducts:builder.query({
            query:()=>({
                url:'user/products/all-products',
                method:"GET"
            }),
            providesTags: ["Product"]
        }),
        getProductById: builder.query({
            query:(id)=>({
                url:`user/products/${id}`,
                method:"GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }]
        }),
        addToCart: builder.mutation({
            query:({productId,quantity})=>({
                url:'cart/add',
                method:"POST",
                body:{productId,quantity}
            }),
            invalidatesTags:['Cart']
        }),
        toggleWishlist: builder.mutation({
            query: (productId) => ({
              url: `wishlist/toggle/${productId}`,
              method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [
              { type: 'Product', id },
              'Wishlist'
            ]
          }),
          addReview: builder.mutation({
            query: ({ productId, rating, comment }) => ({
              url: `products/${productId}/reviews`,
              method: 'POST',
              body: { rating, comment }
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }]
          })
    })
})

export const {useGetNewProductsQuery,useGetProductByIdQuery
    ,useAddToCartMutation,useToggleWishlistMutation,
    useAddReviewMutation,useGetAllProductsQuery} = productApi