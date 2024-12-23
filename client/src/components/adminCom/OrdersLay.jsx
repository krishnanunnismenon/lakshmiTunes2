import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useGetGroupedOrdersQuery } from '@/services/api/admin/orderApi';

export default function GroupedOrdersTable() {
  const { data: groupedOrders, isLoading } = useGetGroupedOrdersQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">User Orders</h1>
      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-white">User</TableHead>
              <TableHead className="text-white">Order Count</TableHead>
              <TableHead className="text-white">Total Amount</TableHead>
              <TableHead className="text-white">Latest Order Date</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedOrders?.map((group) => (
              <TableRow key={group.userId} className="bg-gray-900">
                <TableCell className="text-white">{group.userName}</TableCell>
                <TableCell className="text-white">{group.orderCount}</TableCell>
                <TableCell className="text-white">₹{group.totalAmount?.toFixed(2)}</TableCell>
                <TableCell className="text-white">{new Date(group.latestOrder).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => navigate(`/admin/orders/${group.latestOrderId}`)}
                    variant="outline"
                  >
                    View Latest Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
