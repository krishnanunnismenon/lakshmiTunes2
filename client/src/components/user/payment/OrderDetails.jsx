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

  const mrpTotal = order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = mrpTotal - subtotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items.map((item) => (
          <div key={item.product._id} className="flex justify-between">
            <span>{item.product.name} (x{item.quantity})</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>MRP Total</span>
            <span>₹{mrpTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-500">
            <span>Discount</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Order Total</span>
            <span>₹{order.total.toFixed(2)}</span>
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