import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { useAddCategoryMutation } from '@/services/api/admin/adminApi'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  description: Yup.string()
})

export default function AddNewCategoryLay() {
  const [addCategory, { isLoading }] = useAddCategoryMutation()
  const { toast } = useToast()

  const handleSubmit = async (values, { resetForm }) => {
    try {
     
      const response = await addCategory(values).unwrap()
      toast({
        description: response.message || "Category added successfully",
        className: "bg-green-500 text-white",
      })
      
      resetForm()
      
      console.log('Category added successfully. Redirect to category list.')
    } catch (error) {
      toast({
        description: error.data?.message || "Failed to add category",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-6">ADD CATEGORIES</h1>
        
        <div className="rounded-lg bg-[#1a1b1e] p-6">
          <Formik
            initialValues={{ name: '', description: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Category Name"
                    className="bg-[#2a2b2e] border-gray-700 text-white"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <Field
                    as={Textarea}
                    name="description"
                    placeholder="Description"
                    className="bg-[#2a2b2e] border-gray-700 text-white"
                    rows={4}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding Category...' : 'Add Category'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}