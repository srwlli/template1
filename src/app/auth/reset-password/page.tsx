'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'

interface FormErrors {
  password?: string
  confirmPassword?: string
  general?: string
}

interface ResetState {
  status: 'loading' | 'ready' | 'invalid' | 'expired' | 'success'
  message: string
}

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [resetState, setResetState] = useState<ResetState>({
    status: 'loading',
    message: 'Verifying reset link...'
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()

  // Check for valid reset session on component mount
  useEffect(() => {
    const checkResetSession = async () => {
      try {
        // Get the current session to see if we have a valid reset token
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (session && session.user) {
          // Valid reset session found
          setResetState({
            status: 'ready',
            message: 'Enter your new password below.'
          })
          logUserAction('Password reset session verified', { userId: session.user.id })
        } else {
          // No valid session - link may be invalid or expired
          setResetState({
            status: 'invalid',
            message: 'This password reset link is invalid or has expired.'
          })
        }
      } catch (err: any) {
        logError(err, {
          component: 'ResetPasswordPage',
          action: 'verify_reset_session'
        })
        
        setResetState({
          status: 'invalid',
          message: 'Unable to verify reset link. Please try requesting a new one.'
        })
      }
    }

    checkResetSession()
  }, [])

  // DON'T redirect authenticated users during password reset flow
  // Only redirect if they're on an invalid reset page and already logged in
  useEffect(() => {
    if (user && (resetState.status === 'invalid' || resetState.status === 'expired')) {
      // Only redirect to dashboard if reset link is invalid AND user is already authenticated
      // This prevents the flash redirect issue
      router.push('/dashboard')
    }
    // Removed automatic redirect for 'ready' status to allow password reset
  }, [user, resetState.status, router])

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'password':
        if (!value) return 'New password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return undefined
      case 'confirmPassword':
        if (!value) return 'Please confirm your new password'
        if (value !== password) return 'Passwords do not match'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const passwordError = validateField('password', password)
    const confirmError = validateField('confirmPassword', confirmPassword)

    if (passwordError) newErrors.password = passwordError
    if (confirmError) newErrors.confirmPassword = confirmError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation
  useEffect(() => {
    if (submitAttempted) {
      validateForm()
    }
  }, [password, confirmPassword, submitAttempted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    
    if (!validateForm()) {
      logUserAction('Password reset validation failed', { errors })
      showError('Please fix the errors below')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      logUserAction('Password reset attempt started')

      const { data, error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      if (data.user) {
        logUserAction('Password reset successful', { userId: data.user.id })
        
        setResetState({
          status: 'success',
          message: 'Password updated successfully! Redirecting to dashboard...'
        })

        success('Password Updated!', 'Your password has been changed successfully.')
        
        // Redirect to dashboard after showing success message
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000) // Increased delay to 3 seconds so user can see success message
      }

    } catch (err: any) {
      logError(err, {
        component: 'ResetPasswordForm',
        action: 'password_reset',
      })

      // Handle specific errors
      if (err.message?.includes('session_not_found')) {
        setResetState({
          status: 'expired',
          message: 'Your reset session has expired. Please request a new password reset.'
        })
        showError('Session Expired', 'Please request a new password reset.')
      } else if (err.message?.includes('Password should be at least')) {
        setErrors({ password: 'Password must be at least 6 characters long' })
        showError('Weak password', 'Please choose a stronger password.')
      } else {
        const message = err.message || 'Failed to update password. Please try again.'
        setErrors({ general: message })
        showError('Update Failed', message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldErrorClass = (hasError: boolean) => {
    const baseClass = "appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm transition-colors"
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
    }
    
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
  }

  const getStatusIcon = () => {
    switch (resetState.status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        )
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )
      case 'invalid':
      case 'expired':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )
      case 'ready':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        )
    }
  }

  const getStatusColor = () => {
    switch (resetState.status) {
      case 'success':
        return 'text-green-600'
      case 'invalid':
      case 'expired':
        return 'text-red-600'
      case 'ready':
        return 'text-blue-600'
      default:
        return 'text-blue-600'
    }
  }

  // Show loading or error states
  if (resetState.status !== 'ready' && resetState.status !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className={`mt-2 text-center text-sm ${getStatusColor()}`}>
              {resetState.message}
            </p>
          </div>

          {(resetState.status === 'invalid' || resetState.status === 'expired') && (
            <div className="space-y-4">
              <Link
                href="/auth/forgot-password"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Request New Reset Link
              </Link>
              
              <div className="text-center">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show success state
  if (resetState.status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Password Updated!
            </h2>
            <p className={`mt-2 text-center text-sm ${getStatusColor()}`}>
              {resetState.message}
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              You will be redirected to your dashboard shortly.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/dashboard"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Go to Dashboard Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getFieldErrorClass(!!errors.password)}
                placeholder="Enter your new password (min. 6 characters)"
                disabled={loading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={getFieldErrorClass(!!errors.confirmPassword)}
                placeholder="Confirm your new password"
                disabled={loading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {errors.general}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}