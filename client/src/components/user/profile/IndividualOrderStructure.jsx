import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from 'lucide-react';
import { useGetIndividualOrdersQuery, useCancelUserOrderItemMutation, useCancelUserOrderMutation } from '@/services/api/user/ordersApi';
import { useToast } from '@/hooks/use-toast';

const IndividualOrderStructure = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetIndividualOrdersQuery(orderId);
  
  
  const [cancelOrderItem, { isLoading: isCancellingItem }] = useCancelUserOrderItemMutation();
  const [cancelOrder, { isLoading: isCancellingOrder }] = useCancelUserOrderMutation();
  const { toast } = useToast();

  const handleCancelItem = async (itemId) => {
    try {
      await cancelOrderItem({ orderId, itemId }).unwrap();
      toast({
        description: "Item cancelled successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to cancel item",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId).unwrap();
      toast({
        description: "Order cancelled successfully",
        className: "bg-green-500 text-white",
      });
      navigate('/profile/orders');
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
    <Card>
      <CardHeader>
        <CardTitle>Order Details - #{order?._id.slice(-6)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Order Information</h3>
            <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
            <p>Status: {order?.status}</p>
            <p>Total: ₹{order?.total.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Shipping Address</h3>
            <p>{order?.address[0].name}</p>
            <p>{order?.address[0].house}</p>
            <p>{order?.address[0].city}, {order?.address[0].state} {order?.address[0].pincode}</p>
            <p>{order?.address[0].country}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          {order?.items.map((item) => (
            <Card key={item._id} className="mb-2">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price.toFixed(2)}</p>
                </div>
                {order?.status === 'pending' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelItem(item._id)}
                    disabled={isCancellingItem}
                  >
                    {isCancellingItem ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Cancel Item
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {order?.status === 'pending' && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancellingOrder}
            >
              {isCancellingOrder ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Cancel Entire Order
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualOrderStructure;

