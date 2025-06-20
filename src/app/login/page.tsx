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
  password?: string
  general?: string
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

// Email Verification Help Component
const EmailVerificationHelp = ({ onResend, onDismiss, loading }) => (
  <Card className="mt-6 border-yellow-200 bg-yellow-50">
    <CardContent className="p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Email Verification Needed</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>If you have an account with this email address, it may need verification. Check your inbox for a verification link, or request a new one below.</p>
            <p className="mt-1 text-xs">If you don't have an account, please <Link href="/signup" className="underline font-medium">sign up here</Link>.</p>
          </div>
          <div className="mt-4 space-x-3">
            <button
              onClick={onResend}
              disabled={loading}
              className="text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded font-medium disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>
            <button
              onClick={onDismiss}
              className="text-sm text-yellow-700 hover:text-yellow-600 font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [showEmailVerificationHelp, setShowEmailVerificationHelp] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToastHelpers()

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return undefined
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const emailError = validateField('email', email)
    const passwordError = validateField('password', password)

    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation
  useEffect(() => {
    if (submitAttempted) {
      validateForm()
    }
  }, [email, password, submitAttempted])

  const handleResendVerification = async () => {
    if (!email.trim()) {
      showError('Email Required', 'Please enter your email address first.')
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim()
      })

      if (error) {
        throw error
      }

      success('Email Sent!', 'Please check your inbox for the verification link.')
      setShowEmailVerificationHelp(false)
    } catch (err: any) {
      logError(err, {
        component: 'LoginForm',
        action: 'resend_verification'
      })
      showError('Failed to Send', err.message || 'Could not send verification email.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    
    if (!validateForm()) {
      logUserAction('Login validation failed', { errors })
      showError('Please fix the errors below')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      logUserAction('Login attempt started', { email })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        logUserAction('Login successful', { 
          userId: data.user.id,
          emailConfirmed: !!data.user.email_confirmed_at 
        })

        success('Welcome back!', 'Successfully signed in.')
        router.push('/dashboard')
      }

    } catch (err: any) {
      logError(err, {
        component: 'LoginForm',
        action: 'user_login',
        additionalData: { email }
      })

      if (err.message?.includes('Invalid login credentials')) {
        setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' })
        showError('Invalid Credentials', 'Please check your email and password.')
      } else if (err.message?.includes('Email not confirmed')) {
        setErrors({ general: 'This email address needs to be verified. If you have an account with this email, please check your inbox for a verification link.' })
        setShowEmailVerificationHelp(true)
        showError('Email Not Verified', 'Please verify your email first.')
      } else if (err.message?.includes('Too many requests')) {
        setErrors({ general: 'Too many login attempts. Please wait a moment before trying again.' })
        showError('Too Many Attempts', 'Please wait before trying again.')
      } else {
        const message = err.message || 'An unexpected error occurred. Please try again.'
        setErrors({ general: message })
        showError('Login Failed', message)
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Main Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Or{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                create a new account
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
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
                    placeholder="Enter your email"
                    disabled={loading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={getFieldErrorClass(!!errors.password)}
                    placeholder="Enter your password"
                    disabled={loading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
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
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              {/* Additional Links */}
              <div className="flex items-center justify-center pt-4 border-t">
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Email Verification Help */}
        {showEmailVerificationHelp && (
          <EmailVerificationHelp
            onResend={handleResendVerification}
            onDismiss={() => setShowEmailVerificationHelp(false)}
            loading={loading}
          />
        )}

        {/* Footer */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="text-center p-0">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthRoute>
      <LoginContent />
    </AuthRoute>
  )
}