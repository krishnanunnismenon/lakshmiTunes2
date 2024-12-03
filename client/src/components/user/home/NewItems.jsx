import React from 'react'
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { useGetNewProductsQuery } from '@/services/api/user/productApi'

const NewItems = () => {
  const { data: newProducts, isLoading, error } = useGetNewProductsQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Checkout our New Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newProducts?.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <div className="flex flex-col h-full">
                  <img
                    src={product.thumbnailImage}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-2 text-center">{product.name}</h3>
                    <p className="text-gray-600 text-center">${product.price.toFixed(2)}</p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewItems