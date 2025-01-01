import React, { useState, useRef, useCallback } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAddProductsMutation, useGetCategoriesQuery} from '@/services/api/admin/adminApi'
import { X, Edit } from 'lucide-react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useToast } from '@/hooks/use-toast' 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  brand: Yup.string().required('Brand is required'),
})

export default function AddProducts() {
  const [addProduct, { isLoading }] = useAddProductsMutation()
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingImageIndex, setEditingImageIndex] = useState(null)
  const imageRef = useRef(null)
  const [error, setError] = useState('')
  
  const { toast } = useToast()

  const validateFileType = (file) => {
    if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
      return true
    }
    return false
  }

  const handleImageChange = (files) => {
    const file = files[0]
    if (file) {
      if (validateFileType(file)) {
        setError('')
        const reader = new FileReader()
        reader.onload = () => {
          setCurrentImage(reader.result)
          setCrop({ unit: '%', width: 30, aspect: 1 })
          setIsModalOpen(true)
        }
        reader.readAsDataURL(file)
      } else {
        setError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.')
      }
    }
  }

  const onCropComplete = useCallback((crop) => {
    setCompletedCrop(crop)
  }, [])

  const handleCropSubmit = () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImageUrl = getCroppedImg(imageRef.current, completedCrop)
      if (editingImageIndex !== null) {
        const newImages = [...images]
        newImages[editingImageIndex] = { file: dataURLtoFile(croppedImageUrl, 'cropped-image.jpg'), preview: croppedImageUrl }
        setImages(newImages)
      } else {
        const newImages = [...images, { file: dataURLtoFile(croppedImageUrl, 'cropped-image.jpg'), preview: croppedImageUrl }]
        setImages(newImages)
      }
      setCurrentImage(null)
      setCompletedCrop(null)
      setIsModalOpen(false)
      setEditingImageIndex(null)
    }
  }

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return canvas.toDataURL('image/jpeg')
  }

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while(n--){
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type:mime})
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const editImage = (index) => {
    setCurrentImage(images[index].preview)
    setEditingImageIndex(index)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values, { resetForm }) => {
    const productData = new FormData()
    for(const key in values){
      productData.append(key, values[key])
    }
   
    images.forEach((image) => {
      productData.append('images', image.file)
    })

    try {
      const result = await addProduct(productData).unwrap()
      console.log('Product added successfully:', result)
      
      toast({
        description: result.message || "Product added successfully",
        duration: 3000,
        className: "bg-green-500 text-white",
      })

      resetForm()
      setImages([])
    } catch (error) {
      console.error('Failed to add product:', error)
      toast({
        description: error.data?.message || "Failed to add product",
        duration: 3000,
        className: "bg-red-500 text-white",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-2xl font-bold text-white text-center mb-6">ADD PRODUCTS</h1>
      
      <div className="max-w-2xl mx-auto rounded-lg bg-[#1a1b1e] p-6">
        <Formik
          initialValues={{
            name: '',
            price: '',
            stock: '',
            description: '',
            category: '',
            brand: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue}) => (
            <Form className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Product name</label>
                <Field
                  name="name"
                  as={Input}
                  className="bg-[#2a2b2e] border-gray-700 text-white"
                  placeholder="Product Name"
                />
                {errors.name && touched.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Price</label>
                  <Field
                    name="price"
                    type="number"
                    as={Input}
                    className="bg-[#2a2b2e] border-gray-700 text-white"
                    placeholder="Price"
                  />
                  {errors.price && touched.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Stock</label>
                  <Field
                    name="stock"
                    type="number"
                    as={Input}
                    className="bg-[#2a2b2e] border-gray-700 text-white"
                    placeholder="Stock"
                  />
                  {errors.stock && touched.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <Field
                  name="description"
                  as={Textarea}
                  className="bg-[#2a2b2e] border-gray-700 text-white"
                  placeholder="Description"
                />
                {errors.description && touched.description && <div className="text-red-500 text-sm">{errors.description}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="text-gray-400 text-sm">Category</label>
                  <Select 
                    onValueChange={(value) => setFieldValue('category', value)}
                    name="category"
                  >
                    <SelectTrigger className="bg-[#2a2b2e] border-gray-700 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2b2e] border-gray-700 text-white">
                      {isCategoriesLoading ? (
                        <SelectItem value="loading">Loading categories...</SelectItem>
                      ) : categories?.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="">No categories available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.category && touched.category && <div className="text-red-500 text-sm">{errors.category}</div>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Brand</label>
                  <Field
                    name="brand"
                    as={Input}
                    className="bg-[#2a2b2e] border-gray-700 text-white"
                    placeholder="Brand"
                  />
                  {errors.brand && touched.brand && <div className="text-red-500 text-sm">{errors.brand}</div>}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Product Images (Max 5)</label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleImageChange(e.target.files)}
                  className="bg-[#2a2b2e] border-gray-700 text-white"
                  disabled={images.length >= 5}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image.preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => editImage(index)}
                          className="text-white mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-white"
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
            </Form>
          )}
        </Formik>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1a1b1e] text-white">
          <DialogHeader>
            <DialogTitle>{editingImageIndex !== null ? 'Edit Image' : 'Crop Image'}</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="mt-4">
              <ReactCrop
                src={currentImage}
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={onCropComplete}
              >
                <img ref={imageRef} src={currentImage} alt="Crop me" />
              </ReactCrop>
              <div className="mt-2 space-x-2">
                <Button
                  onClick={handleCropSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={!completedCrop?.width || !completedCrop?.height}
                >
                  Submit Crop
                </Button>
                <Button
                  onClick={() => {
                    setCurrentImage(null)
                    setCompletedCrop(null)
                    setIsModalOpen(false)
                    setEditingImageIndex(null)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

