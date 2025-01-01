import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Loader2 } from 'lucide-react'
import { useUpdateCartItemMutation, useRemoveFromCartMutation } from '@/services/api/user/cartApi'

export default function CartItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation()
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation()

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return
    setQuantity(newQuantity)
    try {
      await updateCartItem({
        productId: item.product._id,
        quantity: newQuantity
      }).unwrap()
    } catch (error) {
      setQuantity(item.quantity)
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemove = async () => {
    try {
      await removeFromCart(item.product._id).unwrap()
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const originalPrice = item.product.price * quantity
  const discountedPrice = item.product.discountedPrice ? item.product.discountedPrice * quantity : originalPrice
  const discount = originalPrice - discountedPrice

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center">
      <div className="col-span-6 flex gap-4">
        <div className="w-20 h-20 relative rounded-md overflow-hidden">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-sm text-red-500 hover:text-red-600"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </div>

      <div className="col-span-3">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max={item.product.stock}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="w-16 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= item.product.stock || quantity >= 5 || isUpdating}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="col-span-3 text-right">
        <div className="text-lg font-semibold">₹{discountedPrice.toFixed(2)}</div>
        {discount > 0 && (
          <div className="text-sm text-gray-500">
            <span className="line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="text-green-500 ml-2">Save ₹{discount.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  )
}