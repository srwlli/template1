'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

// Props interface for ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">Checking authentication...</p>
      </div>
    </div>
  )
}

// Main ProtectedRoute component
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and user is not authenticated
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If user is not authenticated, show loading while redirecting
  // This prevents flash of protected content before redirect
  if (!user) {
    return <LoadingSpinner />
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}