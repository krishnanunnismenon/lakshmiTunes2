import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

const CouponsLay = () => {
  return (
    <div className='container'>
        <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl text-white font-bold'>COUPONS</h1>
            <Button
            onClick>
                <Plus/>Create Coupon
            </Button>
        </div>

        <Card>
            <CardContent>
                <div>
                    <div>ID</div>
                    <div>COUPON TYPE</div>
                    <div>OFFER LIMIT</div>
                    <div>STARTING DATE</div>
                    <div>ENDING DATE</div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default CouponsLay
