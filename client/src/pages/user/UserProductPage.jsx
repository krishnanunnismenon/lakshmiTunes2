import UserLayout from '@/components/customUi/UserLayout'
import NewItems from '@/components/user/home/NewItems'
import ProductDetail from '@/components/user/ProductDetail'
import React from 'react'

const UserProductPage = () => {
  return (
    <UserLayout>
        <ProductDetail/>
        <NewItems/>
    </UserLayout>
  )
}

export default UserProductPage
