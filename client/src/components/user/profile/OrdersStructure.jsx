import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from 'lucide-react';
import { useGetUserOrdersQuery, useCancelUserOrderMutation} from '@/services/api/user/ordersApi';
import { useToast } from '@/hooks/use-toast';

const OrdersStructure = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetUserOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelUserOrderMutation();
  const { toast } = useToast();

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId).unwrap();
      toast({
        description: "Order cancelled successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders?.length > 0 ? (
        orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    Status: <span className="text-primary">{order.status}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Total: ₹{order.total.toFixed(2)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/profile/orders/${order._id}`)}
                  >
                    View Details
                  </Button>
                  {order.status === 'pending' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrdersStructure;

