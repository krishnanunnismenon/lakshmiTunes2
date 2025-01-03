import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetOrderDetailsQuery, useProcessPaymentMutation } from '@/services/api/user/cartApi';
import OrderDetails from './payment/OrderDetails';
import Breadcrumbs from '../customUi/Breadcrumbs';
import RazorpayPayment from './payment/RazorpayPayment';

export default function PaymentStructure() {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [processPayment, { isLoading }] = useProcessPaymentMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderId } = useParams();
  
  const { data: orderDetails, isLoading: isLoadingOrderDetails } = useGetOrderDetailsQuery(orderId);

  const handlePayment = async () => {
    if (paymentMethod === 'cod') {
      try {
        await processPayment({
          orderId,
          paymentMethod: 'cod'
        }).unwrap();
        
        navigate(`/payment/${orderId}/success`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Payment processing failed. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePaymentSuccess = () => {
    navigate(`/payment/${orderId}/success`);
  };

  const handleApplyCoupon = () => {
    toast({
      title: "Info",
      description: "Coupon functionality coming soon",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs currentPage="Payment" />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Choose payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod} 
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay">Razorpay</Label>
                </div>
              </RadioGroup>

              <div className="flex gap-2">
                <Input
                  placeholder="Discount Coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>

              {paymentMethod === 'cod' ? (
                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Place Order
                </Button>
              ) : (
                <RazorpayPayment 
                  orderId={orderId} 
                  amount={orderDetails.total} 
                  onSuccess={handlePaymentSuccess} 
                />
              )}
            </CardContent>
          </Card>
        </div>

        <OrderDetails orderId={orderId}/>
      </div>
    </div>
  );
}