import { userApi } from "./userApi";


export const ordersApi  = userApi.injectEndpoints({
    endpoints:(builder)=>({
        getUserOrders: builder.query({
            query:()=>({
                url:'user/orders',
                method:'GET'
            }),
            providesTags:['Orders']
        }),
        cancelUserOrder: builder.mutation({
            query: (orderId) => ({
                url: `user/${orderId}/cancel`,
                method: "POST"
            }),
            invalidatesTags:['Orders']
        }),
        cancelUserOrderItem:builder.mutation({
            query:({orderId,itemId})=>({
                url:`user/orders/${orderId}/items/${itemId}/cancel`,
                method:"POST"
            }),
            invalidatesTags:['Orders']
        }),
        getIndividualOrders:builder.query({
            query:(orderId)=>({
                url:`user/orders/${orderId}`,
                method:"GET"
            }),
            invalidatesTags:['Orders']
        })
    })
})

export const { useGetUserOrdersQuery, useCancelUserOrderMutation, useCancelUserOrderItemMutation ,
    useGetIndividualOrdersQuery
} = ordersApi