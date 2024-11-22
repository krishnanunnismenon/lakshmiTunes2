import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, ShoppingCart, ListOrdered, Users, Grid, Ticket, Monitor, CreditCard, Percent } from 'lucide-react'

const menuItems = [
  { 
    title: "Dashboard", 
    icon: LayoutGrid, 
    path: "/admin/dashboard" 
  },
  { 
    title: "Orders", 
    icon: ShoppingCart, 
    path: "/admin/orders" 
  },
  { 
    title: "Products", 
    icon: ListOrdered, 
    path: "/admin/products" 
  },
  { 
    title: "Users", 
    icon: Users, 
    path: "/admin/users" 
  },
  { 
    title: "Categories", 
    icon: Grid, 
    path: "/admin/categories" 
  },
  { 
    title: "Coupons", 
    icon: Ticket, 
    path: "/admin/coupons" 
  },
  { 
    title: "Banners", 
    icon: Monitor, 
    path: "/admin/banners" 
  },
  { 
    title: "Payments", 
    icon: CreditCard, 
    path: "/admin/payments" 
  },
  { 
    title: "Offers", 
    icon: Percent, 
    path: "/admin/offers" 
  }
]

const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="w-64 bg-[#1a1b1e] text-white border-r border-gray-800">
      <div className="p-4">
        <h1 className="text-xl font-bold text-yellow-500">LakshmiTunes</h1>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 text-sm
                transition-colors duration-200
                ${isActive 
                  ? 'bg-gray-800 text-yellow-500' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 mr-3 ${isActive ? 'text-yellow-500' : 'text-gray-300'}`} 
              />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar