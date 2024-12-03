import React from 'react'

import AdminSidebar from '@/components/customUi/AdminSidebar'
import { Toaster } from '../ui/toaster'

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#1a1b1e]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
        <Toaster/>
      </div>
    </div>
  )
}