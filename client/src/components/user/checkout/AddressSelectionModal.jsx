import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from 'lucide-react'

export default function AddressSelectionModal({ isOpen, onClose, addresses, onSelect, selectedAddressId }) {
  const [selectedAddress, setSelectedAddress] = useState(selectedAddressId)
 

  useEffect(() => {
    setSelectedAddress(selectedAddressId)
  }, [selectedAddressId])

  const handleSelect = () => {
    const address = addresses.find(addr => addr._id === selectedAddress)
    if (address) {
      onSelect(address)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Address</DialogTitle>
        </DialogHeader>
        {/* <ScrollArea className="max-h-[60vh] pr-4"> */}
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {addresses.map((address) => (
              <div key={address._id} className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value={address._id} id={address._id} />
                <Label htmlFor={address._id} className="flex-grow cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="font-semibold">{address.name}</p>
                    <p>{address.phone}</p>
                    <p>{address.house}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.country}</p>
                    {address.isPrimary && (
                      <p className="text-green-600 dark:text-green-400 mt-2 flex items-center">
                        <Check size={16} className="mr-1" /> Default Address
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        {/* </ScrollArea> */}
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSelect}>Confirm Selection</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
