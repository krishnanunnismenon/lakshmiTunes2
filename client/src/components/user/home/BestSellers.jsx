import React from 'react'
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

const BestSellers = () => {
    const categories = [
        {
          title: "Beginner Guitars",
          image: "/lilartsy-Fe8Jo5XjXwQ-unsplash.jpg",
          description: "Perfect for starting your musical journey",
          link: "/category/beginner-guitars"
        },
        {
          title: "Ukulele",
          image: "/lilartsy-Fe8Jo5XjXwQ-unsplash.jpg",
          description: "Compact and melodious instruments",
          link: "/category/ukulele"
        },
        {
          title: "Custom Collection",
          image: "/lilartsy-Fe8Jo5XjXwQ-unsplash.jpg",
          description: "Premium handcrafted instruments",
          link: "/category/custom-collection"
        }
      ]
    
      return (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Best Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link key={index} to={category.link}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="flex flex-col h-full">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-64 object-cover"
                      />
                      <CardContent className="p-6 flex-grow">
                        <h3 className="text-xl font-semibold mb-2 text-center">{category.title}</h3>
                        <p className="text-gray-600 text-center">{category.description}</p>
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

export default BestSellers
