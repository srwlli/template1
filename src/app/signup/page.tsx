'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return undefined
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return undefined
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const nameError = validateField('name', name)
    const emailError = validateField('email', email)
    const passwordError = validateField('password', password)
    const confirmError = validateField('confirmPassword', confirmPassword)

    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
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
  }, [name, email, password, confirmPassword, submitAttempted])

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
    } catch (err: any) {
      logError(err, {
        component: 'SignupForm',
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
      logUserAction('Signup validation failed', { errors })
      showError('Please fix the errors below')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      logUserAction('Signup attempt started', { email })

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        logUserAction('Signup successful', { 
          userId: data.user.id,
          emailConfirmed: !!data.user.email_confirmed_at 
        })

        if (data.user.email_confirmed_at) {
          success('Account created!', 'Welcome! You are now signed in.')
          router.push('/dashboard')
        } else {
          success(
            'Account created!',
            'Please check your email for a confirmation link to activate your account.'
          )
          
          // Show additional UI for unverified users
          setShowVerificationPrompt(true)
          
          // Clear form but keep email for resend functionality
          setName('')
          setPassword('')
          setConfirmPassword('')
          setSubmitAttempted(false)
        }
      }

    } catch (err: any) {
      logError(err, {
        component: 'SignupForm',
        action: 'user_signup',
        additionalData: { email }
      })

      // Handle specific errors
      if (err.message?.includes('User already registered')) {
        setErrors({ email: 'An account with this email already exists' })
        showError('Account exists', 'Please try signing in instead.')
      } else if (err.message?.includes('Password should be at least')) {
        setErrors({ password: 'Password must be at least 6 characters long' })
        showError('Weak password', 'Please choose a stronger password.')
      } else if (err.message?.includes('Signup is disabled')) {
        setErrors({ general: 'Account registration is currently disabled. Please contact support.' })
        showError('Registration unavailable', 'Please contact support for assistance.')
      } else {
        const message = err.message || 'An unexpected error occurred. Please try again.'
        setErrors({ general: message })
        showError('Signup failed', message)
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

  if (loading && !submitAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={getFieldErrorClass(!!errors.name)}
                placeholder="Enter your full name"
                disabled={loading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getFieldErrorClass(!!errors.password)}
                placeholder="Create a password (min. 6 characters)"
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
                Confirm Password <span className="text-red-500">*</span>
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
                placeholder="Confirm your password"
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </form>

        {/* Email Verification Prompt */}
        {showVerificationPrompt && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">Verify Your Email</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded font-medium disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}