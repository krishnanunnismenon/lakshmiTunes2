import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import Header from './Header'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
        <Toaster />
      </main>
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Links Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/stories" className="text-gray-300 hover:text-white transition-colors">
                    LakshmiTunes Stories
                  </Link>
                </li>
                <li>
                  <Link to="/warranty" className="text-gray-300 hover:text-white transition-colors">
                    Warranty Claim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Center Section - Can be used for additional content */}
            <div className="lg:flex lg:justify-center">
              {/* Add additional footer content here if needed */}
            </div>

          
            <div className="flex flex-col items-start lg:items-end">
              <Button
                variant="secondary"
                className="bg-[#2e2b3a] hover:bg-[#3a3649] text-white mb-4"
              >
                Contact us
              </Button>
              <p className="text-sm text-gray-400">
                © Copyright 2024 LAKSHMITUNES.IN All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout