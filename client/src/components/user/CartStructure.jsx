'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import CartItem from './cart/CartItem'
import CartSummary from './cart/CartSummary'
import { useGetCartQuery, useClearCartMutation, useUpdateCartMutation, useApplyCouponMutation } from '@/services/api/user/cartApi'

export default function CartStructure() {
  const [couponCode, setCouponCode] = useState('')
  const navigate = useNavigate()

  const { data: cart, isLoading } = useGetCartQuery()
  console.log(cart)
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation()
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    )
  }

  const handleUpdateCart = async () => {
    try {
      await updateCart().unwrap()
    } catch (error) {
      console.error('Failed to update cart:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      await applyCoupon(couponCode).unwrap()
      setCouponCode('')
    } catch (error) {
      console.error('Failed to apply coupon:', error)
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Price</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y">
              {cart.map((item,index) => (
                <CartItem key={`${item.product._id}-${index}`} item={item} />
              ))}
            </div>

            {/* Cart Actions */}
            <div className="p-4 border-t flex flex-wrap gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Apply Coupon
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Clear Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={handleUpdateCart}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  )
}

