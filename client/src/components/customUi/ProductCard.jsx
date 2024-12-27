import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAddToCartMutation } from '@/services/api/user/productApi'
import { useToast } from '@/hooks/use-toast'

export function ProductCard({ product }) {
  const [addToCart] = useAddToCartMutation()
  const [isAddingToCart,setIsAddingToCart] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast({
        title: "Success",
        description: "Product added to cart successfully",
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false);
    }
  }


  return (
    <Card className="group overflow-hidden rounded-xl transition-all hover:shadow-lg">
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </p>
          <Button 
          onClick={handleAddToCart}
          size="sm"
          className="transition-all hover:scale-105"
          disabled={isAddingToCart}
        >
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </Button>
        </div>
      </CardContent>
    </Card>
  )
}

