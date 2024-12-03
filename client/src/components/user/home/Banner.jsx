import React from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()
  return (
    <div>
      <section className="relative h-[500px] bg-black text-white">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-serif mb-6">Music Heals Inside</h1>
          <Button onClick={()=>navigate('/shop')}   className="bg-purple-600 hover:bg-purple-700">Browse</Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2">
          <img
            src="/lilartsy-Fe8Jo5XjXwQ-unsplash.jpg"
            alt="Acoustic Guitar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
    </div>
  )
}

export default Banner
