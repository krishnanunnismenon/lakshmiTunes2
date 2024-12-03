import { useParams } from 'react-router-dom'
import EditProduct from '@/components/adminCom/EditProductLay'
import { AdminLayout } from '@/components/customUi/AdminLayout'
import { useGetProductByIdQuery } from '@/services/api/admin/adminApi'

const EditProductPage = () => {
  const { id } = useParams()
  console.log(id)
  const { data: product, isLoading, error } = useGetProductByIdQuery(id)

  if (isLoading) return <AdminLayout><div>Loading...</div></AdminLayout>
  if (error) return <AdminLayout><div>Error: {error.message}</div></AdminLayout>

  return (
    <AdminLayout>
      {product ? <EditProduct product={product} /> : <div>Product not found</div>}
    </AdminLayout>
  )
}

export default EditProductPage