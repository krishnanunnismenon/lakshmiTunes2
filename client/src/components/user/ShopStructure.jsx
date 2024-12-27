import React, { useEffect, useState } from 'react';
import { ProductCard } from '../customUi/ProductCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, Filter } from 'lucide-react';
import { useGetAllProductsQuery } from '@/services/api/user/productApi';
import { AdvancedSort } from './shop/AdvancedSort';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ShopStructure() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('createdAt-desc');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const { data, error, isLoading } = useGetAllProductsQuery({
    page,
    limit: 6,
    sort: sort.split('-')[0],
    order: sort.split('-')[1],
    search: searchTerm,
    minPrice,
    maxPrice,
  });

  useEffect(() => {
    setPage(1);
  }, [sort, searchTerm, minPrice, maxPrice]);

  const handleSearch = (e)=>{
    setSearchTerm(e.target.value);
    setPage(1)
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
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
              onChange={handleSearch}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Sorting</SheetTitle>
                  <SheetDescription>
                    Customize your product view
                  </SheetDescription>
                </SheetHeader>
                <AdvancedSort
                  sort={sort}
                  setSort={setSort}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            // Product cards
            data?.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {data && Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outlin"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

