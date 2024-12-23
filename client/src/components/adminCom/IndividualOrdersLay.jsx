import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetIndividualOrderDetailQuery, useUpdateOrderStatusMutation } from '@/services/api/admin/orderApi';

const statusColors = {
  'pending': 'text-orange-500',
  'processing': 'text-blue-500',
  'shipped': 'text-blue-500',
  'delivered': 'text-green-500',
  'cancelled': 'text-red-500'
};

export default function IndividualOrdersLay() {
  const { individualOrder } = useParams();

  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetIndividualOrderDetailQuery(individualOrder);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus) => {
    try {
        
      await updateStatus({ individualOrder, status: newStatus }).unwrap();
      toast({
        title: "Success",
        description: "Order status updated successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading order details: {error.message}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">No order found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 text-white">
      <Button onClick={() => navigate('/admin/orders')} className="mb-4">
        Back to Orders
      </Button>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Order Details - #{order._id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{order.address[0].name}</p>
              <p>{order.address[0].house}</p>
              <p>{order.address[0].city}, {order.address[0].state} {order.address[0].pincode}</p>
              <p>{order.address[0].country}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Order Status</h3>
            <div className="flex items-center gap-2">
              <span className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <Select
                onValueChange={handleStatusUpdate}
                defaultValue={order.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Product</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-white">{item.product.name}</TableCell>
                  <TableCell className="text-white">{item.quantity}</TableCell>
                  <TableCell className="text-white">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-white">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="font-semibold">Total: ₹{order.total.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

