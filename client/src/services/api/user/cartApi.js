
import { userApi } from "./userApi";

const cartApi = userApi.injectEndpoints({
    endpoints:(builder)=>({
        getCart:builder.query({
            query:()=>({
                url:'user/cart',
                method:"GET"
            }),
            providesTags:['Cart']
        }),
        clearCart:builder.mutation({
            query:()=>({
                url:"user/cart/clear",
                method:"DELETE"
            }),
            invalidatesTags:['Cart']
        }),
        updateCart:builder.mutation({
            query:()=>({
                url:"user/cart/update-all",
                method:"PUT"
            }),
            invalidatesTags:['Cart']
        }),
        applyCoupon:builder.mutation({
            query:(couponCode)=>({
                url:'user/cart/apply-coupon',
                method:"POST",
                body:{couponCode}
            }),
            invalidatesTags:['Cart']
        }),
        updateCartItem:builder.mutation({
            query:({productId,quantity})=>({
                url:'user/cart/update',
                method:"PUT",
                body:{productId,quantity}
            }),
            invalidatesTags:['Cart']
        }),
        removeFromCart:builder.mutation({
            query:(productId)=>({
                url:`user/cart/remove/${productId}`,
                method:"DELETE"
            }),
            invalidatesTags:['Cart']
        }),
        createOrder:builder.mutation({
            query:(orderData)=>({
                url:'user/cart/orders',
                method:'POST',
                body:orderData
            }),
            invalidatesTags:['Cart','Orders']
        }),
        getOrderDetails:builder.query({
            query:(orderId)=>({
                url:`user/cart/orders/${orderId}`,
                method:"GET"
            })
        }),
        processPayment:builder.mutation({
            query:(data)=>({
                url:'user/cart/payment',
                method:'POST',
                body:data
            }),
            invalidatesTags:['Order']
        }),
        createRazorpayOrder:builder.mutation({
            query:(orderData)=>({
                url:'user/cart/payment/create-razorpay-order',
                method:"POST",
                body:orderData
            })
        }),
        verifyRazorpayOrder:builder.mutation({
            query:(paymentData)=>({
                url: 'user/cart/payment/verify-razorpay-order',
                method: 'POST',
                body: paymentData,
            })
        })

    })
})

export const {useGetCartQuery,useClearCartMutation,useUpdateCartMutation,useApplyCouponMutation,
    useUpdateCartItemMutation,useRemoveFromCartMutation,
    useCreateOrderMutation,
    useGetOrderDetailsQuery,useProcessPaymentMutation,
    useCreateRazorpayOrderMutation,useVerifyRazorpayOrderMutation} = cartApi