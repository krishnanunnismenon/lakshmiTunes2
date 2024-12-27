import { useState, useEffect } from 'react'
import { useGetUserAddressQuery } from '@/services/api/user/userApi'
import { useGetCartQuery } from '@/services/api/user/cartApi'
import AddressForm from './checkout/AddressForm'
import OrderSummary from './checkout/OrderSummary'
import AddressSelectionModal from './checkout/AddressSelectionModal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Breadcrumbs from '../customUi/Breadcrumbs'

export default function CheckoutStructure() {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const { data: addresses, isLoading: isLoadingAddresses, refetch } = useGetUserAddressQuery()
  const { data: cart, isLoading: isLoadingCart } = useGetCartQuery()


  
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isPrimary) || addresses[0]
      setSelectedAddress(defaultAddress)
      console.log(defaultAddress)
    }
  }, [addresses])

  if (isLoadingAddresses || isLoadingCart) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const handleAddressSubmit = (newAddress) => {
    setSelectedAddress(newAddress)
    refetch()
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setIsAddressModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs currentPage='Checkout'/>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            
            {selectedAddress ? (
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Selected Address</h3>
                <p>Name: {selectedAddress.name}</p>
                <p>Phone: {selectedAddress.phone}</p>
                <p>{selectedAddress.house}</p>
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                <p>{selectedAddress.country}</p>
                <Button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-4"
                >
                  Change Address
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsAddressModalOpen(true)}
                className="mb-6"
              >
                Select Address
              </Button>
            )}

            <AddressForm onAddressSubmit={handleAddressSubmit} />
          </Card>
        </div>

        <div>
          <OrderSummary cart={cart} selectedAddress={selectedAddress} />
        </div>
      </div>

      <AddressSelectionModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses || []}
        onSelect={handleAddressSelect}
        selectedAddressId={selectedAddress?._id}
      />
    </div>
  )
}

