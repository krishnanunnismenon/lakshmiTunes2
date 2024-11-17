import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const Review = () => {
    const reviews = [
        {
          name: "John Doe",
          rating: 5,
          text: "Amazing quality instruments and excellent service!"
        },
        {
          name: "Jane Smith",
          rating: 5,
          text: "The best place to find your perfect instrument."
        }
      ]
    
      return (
        <section className="py-16 bg-teal-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Customers Love us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {reviews.map((review, index) => (
                <Card key={index} className="bg-white text-black">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-4 text-center">{review.text}</p>
                    <p className="font-semibold text-center">{review.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )
}

export default Review
