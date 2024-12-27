import { userApi } from "./userApi";

const productApi = userApi.injectEndpoints({
    endpoints:(builder)=>({
        getNewProducts: builder.query({
            query: (currentProductId = '') => `user/products/new?exclude=${currentProductId}`,  
        }),
        getAllProducts:builder.query({
            query:(params)=>({
                url:'user/products/all-products',
                method:"GET",
                params:{
                    page:params.page,
                    limit: params.limit,
                    sort: params.sort,
                    order: params.order,
                    search: params.search,
                    minPrice: params.minPrice,
                    maxPrice: params.maxPrice
                }
            }),
            providesTags: ["Product"]
        }),
        getProductById: builder.query({
            query:(id)=>({
                url:`user/products/individual/${id}`,
                method:"GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }]
        }),
        getCart: builder.query({
            query:()=>({
                url:`user/cart`,
                method:"GET"
            }),
            providesTags:['Cart']
          }),
        addToCart: builder.mutation({
            query:({productId,quantity})=>({
                url:'user/cart/add',
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
              url: `user/products/${productId}/reviews`,
              method: 'POST',
              body: { rating, comment }
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Product', id }]
          }),
          
    })
})

export const {useGetNewProductsQuery,useGetProductByIdQuery
    ,useAddToCartMutation,useToggleWishlistMutation,
    useAddReviewMutation,useGetAllProductsQuery,
    useGetCartQuery} = productApi