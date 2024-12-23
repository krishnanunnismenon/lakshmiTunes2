import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetOrderDetailsQuery } from '@/services/api/user/cartApi';

export default function OrderDetails({ orderId }) {
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  if (isLoading) return <div>Loading order details...</div>;
  if (error) return <div>Error loading order details</div>;
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items.map((item) => (
          <div key={item.product._id} className="flex justify-between">
            <span>{item.product.name}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹{order.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Order Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Delivery Address:</p>
              <p>{order.address.name}</p>
              <p>{order.address.house}</p>
              <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
              <p>{order.address.country}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/checkout')}>
              Change
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

