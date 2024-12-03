'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { Pencil, Plus, Trash } from 'lucide-react'
import { 
  useGetCategoriesQuery, 
  useToggleCategoryListingMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation
} from '@/services/api/admin/adminApi'
import { useNavigate } from 'react-router-dom'

export default function ListCategoriesLay() {
  const { data: categories, isLoading } = useGetCategoriesQuery()
  const [toggleListing] = useToggleCategoryListingMutation()
  const [updateCategory] = useEditCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const { toast } = useToast()
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleToggleListing = async (categoryId, currentStatus) => {
    setUpdatingId(categoryId)
    try {
      const response = await toggleListing({ 
        categoryId, 
        isListed: !currentStatus 
      }).unwrap()
      
      toast({
        description: response.message,
        className: "bg-green-500 text-white",
      })
    } catch (error) {
      toast({
        description: "Failed to update category status",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await updateCategory({
        categoryId: editingCategory._id,
        name: editingCategory.name,
        description: editingCategory.description
      }).unwrap()
      toast({
        description: "Category updated successfully",
        className: "bg-green-500 text-white",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        description: "Failed to update category",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    }
  }

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(editingCategory._id).unwrap()
      toast({
        description: "Category deleted successfully",
        className: "bg-green-500 text-white",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      toast({
        description: "Failed to delete category",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    }
  }

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">CATEGORIES</h1>
        <Button 
          onClick={() => navigate('add-category')} 
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-lg bg-[#1a1b1e] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400 font-semibold">CATEGORY</TableHead>
              <TableHead className="text-gray-400 font-semibold text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category._id} className="border-b border-gray-800">
                <TableCell className="font-medium text-white">
                  {category.name}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleToggleListing(category._id, category.isListed)}
                      disabled={updatingId === category._id}
                      className={category.isListed 
                        ? "bg-green-500 hover:bg-green-600 text-white min-w-[80px]"
                        : "bg-red-500 hover:bg-red-600 text-white min-w-[80px]"}
                    >
                      {updatingId === category._id 
                        ? "..." 
                        : (category.isListed ? "LIST" : "UNLIST")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                      onClick={() => openEditModal(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-[#1a1b1e] text-white">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={editingCategory?.name || ''}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="col-span-3 bg-[#2a2b2e] border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editingCategory?.description || ''}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="col-span-3 bg-[#2a2b2e] border-gray-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                Save changes
              </Button>
              <Button type="button" onClick={handleDeleteCategory} className="bg-red-500 hover:bg-red-600 text-white">
                <Trash className="mr-2 h-4 w-4" /> Delete Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}