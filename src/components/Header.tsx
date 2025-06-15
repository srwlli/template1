'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

// Header component
export function Header() {
  const { user, loading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Prevent hydration mismatch with longer delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100) // Small delay to ensure auth is ready
    
    return () => clearTimeout(timer)
  }, [])

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu when clicking a link
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // More conservative loading check
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Navigation skeleton - LEFT SIDE */}
            <div className="flex items-center space-x-8">
              {/* Mobile menu button skeleton */}
              <div className="md:hidden">
                <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
              {/* Desktop navigation skeleton */}
              <div className="hidden md:flex items-center space-x-8">
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-10 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            
            {/* Logo skeleton - RIGHT SIDE */}
            <div className="flex-shrink-0">
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation - LEFT SIDE */}
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!loading && user ? (
                // Authenticated user navigation
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Settings
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    About
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                // Unauthenticated user navigation
                <>
                  <Link 
                    href="/about" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                // Still loading auth state
                <div className="flex items-center space-x-8">
                  <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-10 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              )}
            </div>
          </div>

          {/* Logo - RIGHT SIDE */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              Template
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200 shadow-lg">
              {!loading && user ? (
                // Authenticated mobile navigation
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    About
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                // Unauthenticated mobile navigation
                <>
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                // Loading state for mobile menu
                <div className="space-y-2">
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mx-3"></div>
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mx-3"></div>
                  <div className="h-6 w-18 bg-gray-200 animate-pulse rounded mx-3"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}