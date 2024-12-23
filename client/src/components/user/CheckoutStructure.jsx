import { useState } from 'react'
import { useGetUserAddressQuery } from '@/services/api/user/userApi'
import { useGetCartQuery } from '@/services/api/user/cartApi'
import AddressForm from './checkout/AddressForm'
import OrderSummary from './checkout/OrderSummary'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function CheckoutStructure() {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const { data: addresses, isLoading: isLoadingAddresses, refetch } = useGetUserAddressQuery()
  const { data: cart, isLoading: isLoadingCart } = useGetCartQuery()
  
  if (isLoadingAddresses || isLoadingCart) {
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const defaultAddress = addresses?.find(addr => addr.isPrimary)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
            
            {defaultAddress && (
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Default Address</h3>
                <p>Name: {defaultAddress.name}</p>
                <p>Phone: {defaultAddress.phone}</p>
                <p>{defaultAddress.street}</p>
                <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</p>
                <p>{defaultAddress.country}</p>
              </div>
            )}

            <AddressForm onAddressSubmit={() => {
              
              refetch()
            }} />
          </Card>
        </div>

        <div>
          <OrderSummary cart={cart} selectedAddress={selectedAddress || defaultAddress} />
        </div>
      </div>
    </div>
  )
}

