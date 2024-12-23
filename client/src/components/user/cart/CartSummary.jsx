import { Button } from "@/components/ui/button"
import { Dialog } from "@radix-ui/react-dialog"

export default function CartSummary({ cart, onCheckout }) {

    const subtotal = cart.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    )
    
    const shippingCost = 0.00 
    const total = subtotal + shippingCost
  
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="font-semibold text-lg">Cart Totals</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping</span>
            <div className="text-right">
              <div>Flat Rate: ₹{shippingCost.toFixed(2)}</div>
              {/* <Dialog className="text-sm text-white hover:underline">
                Calculate Shipping
              </Dialog  > */}
            </div>
          </div>
  
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
  
        <Button 
          className="w-full"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    )
  }
  
  