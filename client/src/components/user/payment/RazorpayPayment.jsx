import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useCreateRazorpayOrderMutation,useVerifyRazorpayOrderMutation } from '@/services/api/user/cartApi';

const RazorpayPayment = ({ orderId, amount, onSuccess }) => {
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayOrderMutation();
  const { toast } = useToast();

  console.log(import.meta.env.REACT_APP_RAZORPAY_KEY_ID)
  const handlePayment = async () => {
    try {
        const data  = await createRazorpayOrder({orderId}).unwrap();

      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Lakshmi Tunes',
        description: 'Payment for Order',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(response).unwrap();
            onSuccess();
          } catch (error) {
            toast({
              title: "Error",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };
    //   console.log(new window.Razorpay(options))
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={handlePayment}>
      Pay with Razorpay
    </Button>
  );
};

export default RazorpayPayment;