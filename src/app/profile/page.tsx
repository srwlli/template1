'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormErrors {
  name?: string
  bio?: string
  location?: string
  general?: string
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// Error Alert Component
const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
    <div className="flex items-center">
      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      {message}
    </div>
  </div>
)

// Character Counter Component
const CharacterCounter = ({ text, max }) => {
  const current = text.length
  const isOverLimit = current > max
  return (
    <p className={`mt-1 text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
      {current}/{max} characters {isOverLimit && '(over limit)'}
    </p>
  )
}

// Account Info Item Component
const AccountInfoItem = ({ label, value, type = 'text' }) => {
  const renderValue = () => {
    switch (type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : 'Unknown'
      case 'verification':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {value ? 'Verified' : 'Pending Verification'}
          </span>
        )
      case 'id':
        return value ? (
          <span className="font-mono">{value.substring(0, 8)}...</span>
        ) : 'Unknown'
      default:
        return value || 'Unknown'
    }
  }

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {renderValue()}
      </dd>
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuth() // ✅ ADDED: Real auth hook
  const { success, error: showError } = useToastHelpers() // ✅ ADDED: Toast notifications

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  // ✅ ADDED: Load real user profile data
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '')
      setBio(user.user_metadata?.bio || '')
      setLocation(user.user_metadata?.location || '')
    }
  }, [user])

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (value.trim() && value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 100) return 'Name must be less than 100 characters'
        return undefined
      case 'bio':
        if (value.trim().length > 500) return 'Bio must be less than 500 characters'
        return undefined
      case 'location':
        if (value.trim().length > 100) return 'Location must be less than 100 characters'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const nameError = validateField('name', name)
    const bioError = validateField('bio', bio)
    const locationError = validateField('location', location)

    if (nameError) newErrors.name = nameError
    if (bioError) newErrors.bio = bioError
    if (locationError) newErrors.location = locationError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation
  useEffect(() => {
    if (submitAttempted) {
      validateForm()
    }
  }, [name, bio, location, submitAttempted])

  // ✅ REPLACED: Real Supabase updateUser call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    
    if (!validateForm()) {
      logUserAction('Profile validation failed', { errors })
      showError('Please fix the errors below')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      logUserAction('Profile update attempt started', { userId: user?.id })

      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          bio: bio.trim(),
          location: location.trim(),
        },
      })

      if (error) {
        throw error
      }

      logUserAction('Profile update successful', { 
        userId: user?.id,
        updatedFields: { name: name.trim(), bio: bio.trim(), location: location.trim() }
      })

      success('Profile Updated!', 'Your changes have been saved successfully.')

    } catch (err: any) {
      logError(err, {
        component: 'ProfileForm',
        action: 'update_profile',
        additionalData: { userId: user?.id }
      })

      // ✅ ADDED: Proper error handling
      if (err.message?.includes('rate limit')) {
        setErrors({ general: 'Too many updates. Please wait a moment before trying again.' })
        showError('Rate Limited', 'Please wait before updating again.')
      } else if (err.message?.includes('network')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' })
        showError('Network Error', 'Please check your connection.')
      } else {
        const message = err.message || 'An unexpected error occurred. Please try again.'
        setErrors({ general: message })
        showError('Update Failed', message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldErrorClass = (hasError: boolean) => {
    const baseClass = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors"
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
    }
    
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information and preferences.</p>
          </div>

          {/* Profile Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details below.</CardDescription>
            </CardHeader>

            <CardContent>
              {/* ✅ ADDED: Proper form submission */}
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Email Field (Disabled) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if you need to update your email address.
                  </p>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={getFieldErrorClass(!!errors.name)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Bio Field */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={getFieldErrorClass(!!errors.bio)}
                    placeholder="Tell us a little about yourself..."
                    disabled={loading}
                    aria-invalid={!!errors.bio}
                    aria-describedby={errors.bio ? 'bio-error' : 'bio-help'}
                  />
                  {errors.bio ? (
                    <p id="bio-error" className="mt-1 text-sm text-red-600">
                      {errors.bio}
                    </p>
                  ) : (
                    <div id="bio-help">
                      <p className="mt-1 text-xs text-gray-500">
                        Brief description for your profile.
                      </p>
                      <CharacterCounter text={bio} max={500} />
                    </div>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={getFieldErrorClass(!!errors.location)}
                    placeholder="City, Country"
                    disabled={loading}
                    aria-invalid={!!errors.location}
                    aria-describedby={errors.location ? 'location-error' : undefined}
                  />
                  {errors.location && (
                    <p id="location-error" className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <ErrorAlert message={errors.general} />
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account details and membership information.</CardDescription>
            </CardHeader>

            <CardContent>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <AccountInfoItem
                  label="Account Created"
                  value={user?.created_at}
                  type="date"
                />
                <AccountInfoItem
                  label="Last Sign In"
                  value={user?.last_sign_in_at}
                  type="date"
                />
                <AccountInfoItem
                  label="Email Verified"
                  value={user?.email_confirmed_at}
                  type="verification"
                />
                <AccountInfoItem
                  label="User ID"
                  value={user?.id}
                  type="id"
                />
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}