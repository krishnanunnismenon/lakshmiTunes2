'use client'

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, ChevronLeft, ChevronRight, Minus, Plus, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetProductByIdQuery, useAddToCartMutation, useToggleWishlistMutation } from '@/services/api/user/productApi'

export default function ProductDetail() {
  const { productId } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const [toggleWishlist, { isTogglingWishlist }] = useToggleWishlistMutation()

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  )

  if (error) return <div className="text-center text-red-500">Error loading product</div>

  if (!product) return <div className="text-center">Product not found</div>

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity }).unwrap()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(productId).unwrap()
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    }
  }

  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.target.getBoundingClientRect()
    const x = (event.clientX - left) / width
    const y = (event.clientY - top) / height
    setMousePosition({ x, y })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          <div 
            className="aspect-square relative overflow-hidden rounded-lg cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.name} - View ${currentImageIndex + 1}`}
              className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={handleNextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < product.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">₹{product.price.toFixed(2)}</h2>
            {product.freeShipping && (
              <span className="text-green-600 text-sm">Free Shipping</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(q => Math.min(product.inStock, q + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.inStock} units available
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
            >
              <Heart
                className={`w-4 h-4 ${
                  product.isInWishlist ? 'fill-current text-red-500' : ''
                }`}
              />
            </Button>
          </div>

          {/* Additional Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Product Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews?.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.userName}</span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}