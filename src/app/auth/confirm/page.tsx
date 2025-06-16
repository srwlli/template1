# Email Verification Flow Enhancement

## 1. Email Confirmation Page (`src/app/auth/confirm/page.tsx`)

```typescript
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired' | 'invalid'
  message: string
  showResend?: boolean
}

function EmailConfirmContent() {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  })
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error: showError } = useToastHelpers()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') ?? '/dashboard'

        if (!token_hash || type !== 'email') {
          setVerificationState({
            status: 'invalid',
            message: 'Invalid verification link. Please check your email for the correct link.',
            showResend: true
          })
          return
        }

        logUserAction('Email verification attempt', { token_hash: token_hash.substring(0, 8) + '...' })

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        })

        if (error) {
          logError(error, {
            component: 'EmailConfirmation',
            action: 'verify_email',
            additionalData: { type, hasToken: !!token_hash }
          })

          if (error.message.includes('expired')) {
            setVerificationState({
              status: 'expired',
              message: 'Your verification link has expired. Please request a new one.',
              showResend: true
            })
          } else {
            setVerificationState({
              status: 'error',
              message: error.message || 'Failed to verify email. Please try again.',
              showResend: true
            })
          }
          return
        }

        if (data.user) {
          logUserAction('Email verified successfully', { 
            userId: data.user.id,
            email: data.user.email 
          })

          setVerificationState({
            status: 'success',
            message: 'Email verified successfully! Redirecting to your dashboard...'
          })

          success('Email Verified!', 'Your account is now active.')
          
          // Redirect after showing success message
          setTimeout(() => {
            router.push(next)
          }, 2000)
        }
      } catch (err: any) {
        logError(err, {
          component: 'EmailConfirmation',
          action: 'email_verification_error'
        })

        setVerificationState({
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
          showResend: true
        })
      }
    }

    confirmEmail()
  }, [searchParams, router, success])

  const handleResendEmail = async () => {
    const email = searchParams.get('email')
    
    if (!email) {
      showError('Email Required', 'Please go back to the signup page to request a new verification email.')
      return
    }

    setResending(true)
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        throw error
      }

      success('Email Sent!', 'Please check your email for the new verification link.')
      setVerificationState(prev => ({
        ...prev,
        message: 'New verification email sent. Please check your inbox.'
      }))
    } catch (err: any) {
      logError(err, {
        component: 'EmailConfirmation',
        action: 'resend_verification'
      })
      showError('Failed to Send', err.message || 'Could not send verification email.')
    } finally {
      setResending(false)
    }
  }

  const getStatusIcon = () => {
    switch (verificationState.status) {
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
      case 'error':
      case 'expired':
      case 'invalid':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )
    }
  }

  const getStatusColor = () => {
    switch (verificationState.status) {
      case 'success':
        return 'text-green-600'
      case 'error':
      case 'expired':
      case 'invalid':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
          <p className={`mt-2 text-center text-sm ${getStatusColor()}`}>
            {verificationState.message}
          </p>
        </div>

        <div className="space-y-4">
          {verificationState.showResend && (
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <EmailConfirmContent />
    </Suspense>
  )
}
```

## 2. Email Verification Status Component (`src/components/EmailVerificationBanner.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useToastHelpers } from './ToastProvider'
import { supabase } from '@/lib/supabase'
import { logError, logUserAction } from '@/lib/errorLogger'

export default function EmailVerificationBanner() {
  const { user } = useAuth()
  const [resending, setResending] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { success, error: showError } = useToastHelpers()

  // Don't show banner if user is verified, not logged in, or dismissed
  if (!user || user.email_confirmed_at || dismissed) {
    return null
  }

  const handleResendEmail = async () => {
    if (!user.email) return

    setResending(true)
    
    try {
      logUserAction('Resend verification email attempted', { userId: user.id })

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      })

      if (error) {
        throw error
      }

      success('Email Sent!', 'Please check your inbox for the verification link.')
      logUserAction('Verification email resent successfully', { userId: user.id })
    } catch (err: any) {
      logError(err, {
        component: 'EmailVerificationBanner',
        action: 'resend_verification',
        additionalData: { userId: user.id }
      })
      showError('Failed to Send', 'Could not send verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Please verify your email address.</strong> We've sent a verification link to{' '}
              <span className="font-medium">{user.email}</span>. Check your inbox and click the link to activate your account.
            </p>
            <div className="mt-2">
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : 'Resend Email'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 3. Enhanced Signup Page Updates (`src/app/signup/page.tsx`)

Add these improvements to your existing signup page:

```typescript
// Add after the existing handleSubmit function
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

// Update the success message section in handleSubmit:
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

// Add state for verification prompt
const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)

// Add this section after the form and before closing div:
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
```

## 4. Enhanced Login Page Updates (`src/app/login/page.tsx`)

Update your login error handling:

```typescript
// Enhanced error handling in the catch block of handleSubmit:
} catch (err: any) {
  logError(err, {
    component: 'LoginForm',
    action: 'user_login',
    additionalData: { email }
  })

  // Handle specific error cases
  if (err.message?.includes('Invalid login credentials')) {
    setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' })
    showError('Login failed', 'Invalid email or password.')
  } else if (err.message?.includes('Email not confirmed')) {
    setErrors({ general: 'Please verify your email address before signing in.' })
    setShowEmailVerificationHelp(true)
    showError('Email not confirmed', 'Please verify your email first.')
  } else if (err.message?.includes('Too many requests')) {
    setErrors({ general: 'Too many login attempts. Please wait a moment before trying again.' })
    showError('Too many attempts', 'Please wait before trying again.')
  } else {
    const message = err.message || 'An unexpected error occurred. Please try again.'
    setErrors({ general: message })
    showError('Login failed', message)
  }
} finally {
  setLoading(false)
}

// Add state for email verification help
const [showEmailVerificationHelp, setShowEmailVerificationHelp] = useState(false)

// Add this helper function for resending verification
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

// Add this section after the form:
{showEmailVerificationHelp && (
  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
        <div className="mt-2 text-sm text-yellow-700">
          <p>Your email address hasn't been verified yet. Please check your inbox for a verification link, or request a new one.</p>
        </div>
        <div className="mt-4 space-x-3">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification'}
          </button>
          <button
            onClick={() => setShowEmailVerificationHelp(false)}
            className="text-sm text-yellow-700 hover:text-yellow-600 font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

## 5. Update Middleware for Auth Callback (`middleware.ts`)

Add the auth callback route to your middleware:

```typescript
// Update the config matcher to exclude auth callback
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - auth/confirm (email verification callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/confirm|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## 6. Layout Integration

Add the EmailVerificationBanner to your main layout (`src/app/layout.tsx`):

```typescript
import EmailVerificationBanner from '@/components/EmailVerificationBanner'

// Inside your RootLayout component, after the Header:
<Header />
<EmailVerificationBanner />
<main>{children}</main>
```

## Summary of Enhancements

1. **Dedicated Email Confirmation Page** - Handles the verification process with proper error states
2. **Email Verification Banner** - Shows persistent reminder for unverified users
3. **Resend Functionality** - Multiple places to resend verification emails
4. **Enhanced Error Handling** - Better UX for verification-related errors
5. **Visual Feedback** - Clear status indicators and helpful messaging
6. **Middleware Updates** - Proper routing for auth callbacks

This implementation provides a complete, user-friendly email verification flow that guides users through the verification process with clear feedback and multiple recovery options.