import { Link, useNavigate } from "react-router-dom"
import { Menu, Search, User, ShoppingCart, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/slice/userSlice"
import { logOut } from "@/redux/slice/authSlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  

  const handleLogout = () => {
    dispatch(logOut())
    localStorage.removeItem('userToken')
    navigate('/login')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white h-14">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-14">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/home" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm hover:text-primary transition-colors">
                Shop
              </Link>
              <Link to="/collections" className="text-sm hover:text-primary transition-colors">
                Collections
              </Link>
              <Link to="/about" className="text-sm hover:text-primary transition-colors">
                About us
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden text-white p-1">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open main menu</span>
            </Button>

            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
              LAKSHMI TUNES
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white p-2 h-8 w-8">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white p-2 h-8 w-8">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={()=>navigate('/profile')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-white p-2 h-8 w-8">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User account</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate('/cart')} className="text-white p-2 h-8 w-8">
                <ShoppingCart  className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div className="h-14"></div>
    </>
  )
}

export default Header