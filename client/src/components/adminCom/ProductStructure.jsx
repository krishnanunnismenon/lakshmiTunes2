import React from 'react'
import { Plus, Pencil } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { useGetProductsQuery, useUpdateProductStatusMutation } from "@/services/api/admin/adminApi"
import { useToast } from '@/hooks/use-toast'

export default function ProductStructure() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: products, isLoading, isError } = useGetProductsQuery()
  const [updateProductStatus] = useUpdateProductStatusMutation()

  const handleStatusChange = async (productId, currentListed) => {
    if (!productId) {
      console.error('Product ID is undefined')
      toast({
        title: "Error",
        description: "Unable to update product status. Invalid product ID.",
        variant: "destructive",
      })
      return
    }

    const newListed = !currentListed
    try {
      const result = await updateProductStatus({ id: productId, listed: newListed }).unwrap()
      console.log('Update result:', result)
      toast({
        title: "Success",
        description: `Product ${newListed ? 'listed' : 'unlisted'} successfully.`,
        variant: "default",
      })
    } catch (error) {
      console.error('Failed to update product status:', error)
      let errorMessage = "Failed to update product status. Please try again."
      if (error.data && error.data.message) {
        errorMessage = error.data.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div className="text-white">Loading...</div>
  if (isError) return <div className="text-red-500">Error loading products</div>

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">PRODUCTS</h1>
        <Button onClick={() => navigate('add-product')} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="mr-2 h-4 w-4" /> Add Products
        </Button>
      </div>

      <div className="rounded-lg bg-[#1a1b1e] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400">PRODUCTS</TableHead>
              <TableHead className="text-gray-400">CATEGORY</TableHead>
              <TableHead className="text-gray-400">IMAGE</TableHead>
              <TableHead className="text-gray-400">PRICE</TableHead>
              <TableHead className="text-gray-400">STOCK</TableHead>
              <TableHead className="text-gray-400">BRAND</TableHead>
              <TableHead className="text-gray-400">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product) => (
              <TableRow 
                key={product._id} 
                className="border-b border-gray-800"
              >
                <TableCell className="text-white">{product.name}</TableCell>
                <TableCell className="text-white">{product.category}</TableCell>
                <TableCell className="text-white">
                  {/* {product.thumbnailImage && (
                    <img 
                      src={product.thumbnailImage} 
                      alt={`${product.name} thumbnail`} 
                      className="w-16 h-16 object-cover"
                    />
                  )} */}
                </TableCell>
                <TableCell className="text-white">{product.price}</TableCell>
                <TableCell className="text-white">{product.stock}</TableCell>
                <TableCell className="text-white">{product.brand}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    className={`px-2 py-1 rounded text-xs ${
                      product.listed 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                    onClick={() => handleStatusChange(product._id, product.listed)}
                  >
                    {product.listed ? 'LISTED' : 'UNLISTED'}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-blue-500"
                    onClick={() => navigate(`edit-product/${product._id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {product.name}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

