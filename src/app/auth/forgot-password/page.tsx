'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'
import { AuthRoute } from '@/components/AuthRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormErrors {
  email?: string
  general?: string
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// Success Icon Component
const SuccessIcon = () => (
  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  </div>
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const { user } = useAuth() // ✅ ADDED: Real auth hook
  const { success, error: showError } = useToastHelpers() // ✅ ADDED: Toast notifications

  // ✅ ADDED: Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const emailError = validateField('email', email)
    if (emailError) newErrors.email = emailError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation
  useEffect(() => {
    if (submitAttempted) {
      validateForm()
    }
  }, [email, submitAttempted])

  // ✅ REPLACED: Real Supabase password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    
    if (!validateForm()) {
      logUserAction('Forgot password validation failed', { errors })
      showError('Please fix the errors below')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      logUserAction('Password reset attempt started', { email })

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      logUserAction('Password reset email sent', { email })

      // Always show success for security (don't reveal if email exists)
      setEmailSent(true)
      success('Email Sent!', 'If an account with this email exists, you will receive a password reset link.')

    } catch (err: any) {
      logError(err, {
        component: 'ForgotPasswordForm',
        action: 'password_reset',
        additionalData: { email }
      })

      // ✅ ADDED: Proper error handling
      if (err.message?.includes('Too many requests')) {
        setErrors({ general: 'Too many reset requests. Please wait a moment before trying again.' })
        showError('Rate Limited', 'Please wait before trying again.')
      } else if (err.message?.includes('rate limit')) {
        setErrors({ general: 'Too many attempts. Please wait 60 seconds before trying again.' })
        showError('Too Many Attempts', 'Please wait before trying again.')
      } else {
        // Use generic message for security (don't reveal if email exists)
        const message = 'If an account with this email exists, you will receive a password reset link.'
        setErrors({ general: message })
        success('Email Sent!', message)
        setEmailSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ ADDED: Resend functionality
  const handleResend = async () => {
    if (!email.trim()) {
      showError('Email Required', 'Please enter your email address first.')
      return
    }

    setLoading(true)
    
    try {
      logUserAction('Password reset resend attempt', { email })

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      success('Email Sent!', 'New password reset email sent.')

    } catch (err: any) {
      logError(err, {
        component: 'ForgotPasswordForm',
        action: 'password_reset_resend',
        additionalData: { email }
      })
      showError('Send Failed', 'Unable to send reset email. Please try again later.')
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

  // ✅ ADDED: Loading state for auth check
  if (loading && !submitAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-lg border-green-200 bg-green-50/50">
            <CardHeader className="text-center">
              <SuccessIcon />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-base">
                We've sent password reset instructions to{' '}
                <span className="font-medium text-gray-900">{email}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'try again'}
                </button>
              </p>
              
              <div className="text-center pt-4 border-t">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Reset your password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ ADDED: Proper form submission */}
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getFieldErrorClass(!!errors.email)}
                  placeholder="Enter your email address"
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* General Error Message */}
              {errors.general && (
                <ErrorAlert message={errors.general} />
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
                      <LoadingSpinner />
                      Sending email...
                    </div>
                  ) : (
                    'Send Reset Email'
                  )}
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-4 border-t">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}