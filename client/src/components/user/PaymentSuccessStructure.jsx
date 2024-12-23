import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from 'lucide-react';

export default function PaymentSuccessStructure() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-green-500">
              Payment Successful
            </h1>
            
            <p className="text-gray-600">
              Your Order Is Confirmed. You Will Receive An Order Confirmation Email/SMS
            </p>

            <p className="text-sm text-gray-500">
              Order ID: {orderId}
            </p>
          </div>

          <Button 
            className="w-full"
            onClick={() => navigate('/home')}
          >
            Continue To Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

