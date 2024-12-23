import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateOrderMutation } from '@/services/api/user/cartApi'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function OrderSummary({ cart, selectedAddress }) {
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const subtotal = cart?.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  ) || 0
 
  
  const shipping = 0 
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        status: "error"
      })
      return
    }

    try {

      const order = await createOrder({
        addressId: selectedAddress._id,
        items: cart?.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
        
      }).unwrap()
      

      
      navigate(`/payment/${order._id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        status: "error"
      })
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      
      <div className="space-y-4">
        {cart?.items?.map((item) => (
          <div key={item.product._id} className="flex justify-between">
            <span>{item.product.name}</span>
            <span>${item.product.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>${subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Order Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleCheckout}
          disabled={isLoading || !selectedAddress}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Continue
        </Button>
      </div>
    </Card>
  )
}

