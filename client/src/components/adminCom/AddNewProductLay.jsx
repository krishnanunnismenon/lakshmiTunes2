import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAddProductsMutation } from '@/services/api/admin/adminApi'
import { X } from 'lucide-react'

export default function AddProducts() {
  const [addProduct, { isLoading }] = useAddProductsMutation()
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    brand: ''
  })

  const handleImageChange = (files) => {
    const newImages = Array.from(files).map((file) => ({
      file
    }))
    setImages((prevImages) => [...prevImages, ...newImages])
    
  }
  console.log(images)

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const productData = new FormData()
    console.log(productData)
    for(const key in formData){
      console.log(key)
        productData.append(key,formData[key])
    }

   
   
    images.forEach((image) => {

      console.log(image,"imge, =ujust before appneing")
      productData.append('images', image.file)
    })


    try {
    
      const result = await addProduct(productData).unwrap()
      console.log('Product added successfully:', result)
      setFormData({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        brand: ''
      })
      setImages([])
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-2xl font-bold text-white text-center mb-6">ADD PRODUCTS</h1>
      
      <div className="max-w-2xl mx-auto rounded-lg bg-[#1a1b1e] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Product name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#2a2b2e] border-gray-700 text-white"
              placeholder="Product Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Price</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="bg-[#2a2b2e] border-gray-700 text-white"
                placeholder="Price"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Stock</label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="bg-[#2a2b2e] border-gray-700 text-white"
                placeholder="Stock"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-[#2a2b2e] border-gray-700 text-white"
              placeholder="Description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Category</label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-[#2a2b2e] border-gray-700 text-white"
                placeholder="Category"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Brand</label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="bg-[#2a2b2e] border-gray-700 text-white"
                placeholder="Brand"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Product Images (Max 5)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files)}
              
              multiple
              className="bg-[#2a2b2e] border-gray-700 text-white"
              disabled={images.length >= 5}
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <div className="bg-[#2a2b2e] text-white px-3 py-1 rounded flex items-center">
                    {image.name}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </div>
    </div>
  )
}