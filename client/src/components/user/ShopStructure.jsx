import React, { useState } from 'react'

import { ProductCard } from '../customUi/ProductCard'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Music2 } from 'lucide-react'
import { useGetAllProductsQuery } from '@/services/api/user/productApi'

export default function ShopStructure() {
  const { data: products, error, isLoading } = useGetAllProductsQuery()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">Failed to load products</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Music Shop</h1>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search products..."
              className="w-64 bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            // Product cards
            filteredProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3, 4].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

