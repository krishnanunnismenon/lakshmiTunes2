
import { adminApi } from "./adminApi";



const orderApi = adminApi.injectEndpoints({
    
    endpoints:(builder)=>({
        getGroupedOrders:builder.query({
            query:()=>({
                url:'/admin/orders',
                method:'GET'
            }),
            provideTags:["AdminOrders"]
        }),
        updateOrderStatus: builder.mutation({
            query:({individualOrder,status})=>({
                url:`/admin/orders/${individualOrder}/status`,
                method:'PUT',
                body:{status}
            }),
            invalidatesTags:["IndividualOrder"]
        }),
        getIndividualOrderDetail:builder.query({    
            query:(individualOrder)=>({
                url:`/admin/orders/${individualOrder}`,
                method:'GET'
            }),
            providesTags:['IndividualOrder']
        }),
                
    })
})

export const {useGetGroupedOrdersQuery,useUpdateOrderStatusMutation,
    useGetIndividualOrderDetailQuery
} = orderApi

