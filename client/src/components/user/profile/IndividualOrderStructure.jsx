import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from 'lucide-react';
import { useGetIndividualOrdersQuery, useCancelUserOrderItemMutation, useCancelUserOrderMutation } from '@/services/api/user/ordersApi';
import { useToast } from '@/hooks/use-toast';
import CancelOrderModal from '@/components/userCom/CancelOrderModal';
import { Badge } from "@/components/ui/badge";

const IndividualOrderStructure = () => {
    
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetIndividualOrdersQuery(orderId);
  const [cancelOrderItem, { isLoading: isCancellingItem }] = useCancelUserOrderItemMutation();
  const [cancelOrder, { isLoading: isCancellingOrder }] = useCancelUserOrderMutation();
  const { toast } = useToast();
  order?.items.map((item)=>console.log(item.product))

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingItemId, setCancellingItemId] = useState(null);

  const handleCancelItem = async (itemId, reason) => {
    try {
      await cancelOrderItem({ orderId, itemId, reason }).unwrap();
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

  const handleCancelOrder = async (reason) => {
    try {
      await cancelOrder({ orderId, reason }).unwrap();
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

  const openCancelModal = (itemId = null) => {
    setCancellingItemId(itemId);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancellingItemId(null);
    setIsCancelModalOpen(false);
  };

  const confirmCancel = (reason) => {
    if (cancellingItemId) {
      handleCancelItem(cancellingItemId, reason);
    } else {
      handleCancelOrder(reason);
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
        <CardTitle className="flex justify-between items-center">
          <span>Order Details - #{order?._id.slice(-6)}</span>
          <Badge variant={order?.status === 'pending' ? 'default' : order?.status === 'delivered' ? 'success' : 'secondary'}>
            {order?.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Order Information</h3>
            <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
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
                <div className="flex items-center space-x-4">
                  <img src={item.product.thumbnailImage} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <Badge variant={item.status === 'pending' ? 'default' : item.status === 'delivered' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                {item.status === 'pending' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openCancelModal(item._id)}
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
        {order?.items.some(item => item.status === 'pending') && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => openCancelModal()}
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
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancel}
        isItem={!!cancellingItemId}
      />
    </Card>
  );
};

export default IndividualOrderStructure;

