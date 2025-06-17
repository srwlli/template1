'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired' | 'invalid'
  message: string
  showResend?: boolean
}

// Status Icon Component
const StatusIcon = ({ status }) => {
  switch (status) {
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
    default:
      return null
  }
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

function EmailConfirmContent() {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  })
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth() // ✅ ADDED: Real auth hook
  const { success, error: showError } = useToastHelpers() // ✅ ADDED: Toast notifications

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

        logUserAction('Email verification attempt started', { token_hash: token_hash.substring(0, 8) + '...' })

        // ✅ REPLACED: Real Supabase email verification
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        })

        if (error) {
          throw error
        }

        if (data.user) {
          logUserAction('Email verification successful', { 
            userId: data.user.id,
            emailConfirmed: !!data.user.email_confirmed_at 
          })

          setVerificationState({
            status: 'success',
            message: 'Email verified successfully! Redirecting to your dashboard...'
          })

          success('Email Verified!', 'Your account has been activated successfully.')

          // Redirect after showing success message
          setTimeout(() => {
            router.push(next)
          }, 2000)
        }

      } catch (err: any) {
        logError(err, {
          component: 'EmailConfirmPage',
          action: 'email_verification',
          additionalData: { 
            token_hash: searchParams.get('token_hash')?.substring(0, 8) + '...',
            type: searchParams.get('type')
          }
        })

        // ✅ ADDED: Proper error handling
        if (err.message?.includes('Token has expired')) {
          setVerificationState({
            status: 'expired',
            message: 'This verification link has expired. Please request a new one.',
            showResend: true
          })
          showError('Link Expired', 'Please request a new verification email.')
        } else if (err.message?.includes('Invalid token')) {
          setVerificationState({
            status: 'invalid',
            message: 'Invalid verification link. Please check your email for the correct link.',
            showResend: true
          })
          showError('Invalid Link', 'Please use the most recent verification email.')
        } else {
          setVerificationState({
            status: 'error',
            message: 'An unexpected error occurred. Please try again.',
            showResend: true
          })
          showError('Verification Failed', err.message || 'Please try again.')
        }
      }
    }

    confirmEmail()
  }, [searchParams, router, success, showError])

  // ✅ REPLACED: Real resend email functionality
  const handleResendEmail = async () => {
    const email = searchParams.get('email')
    
    if (!email) {
      showError('Email Required', 'Please go back to the signup page to request a new verification email.')
      return
    }

    setResending(true)
    
    try {
      logUserAction('Resend verification email attempt', { email })

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        throw error
      }

      success('Email Sent!', 'New verification email sent. Please check your inbox.')
      setVerificationState(prev => ({
        ...prev,
        message: 'New verification email sent. Please check your inbox.'
      }))

    } catch (err: any) {
      logError(err, {
        component: 'EmailConfirmPage',
        action: 'resend_verification',
        additionalData: { email }
      })
      showError('Send Failed', err.message || 'Could not send verification email.')
    } finally {
      setResending(false)
    }
  }

  // ✅ ADDED: Redirect if already authenticated
  useEffect(() => {
    if (user && verificationState.status === 'loading') {
      // User is already logged in, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, verificationState.status, router])

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

  const getCardVariant = () => {
    switch (verificationState.status) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'error':
      case 'expired':
      case 'invalid':
        return 'border-red-200 bg-red-50/50'
      default:
        return 'border-blue-200 bg-blue-50/50'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className={`${getCardVariant()} shadow-lg`}>
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <StatusIcon status={verificationState.status} />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email Verification
            </CardTitle>
            <CardDescription className={`text-base ${getStatusColor()}`}>
              {verificationState.message}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {verificationState.showResend && (
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resending ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            )}

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

        {/* Additional Help Card */}
        {verificationState.status === 'error' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>If you're having trouble with email verification:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your spam/junk folder</li>
                <li>Make sure you clicked the most recent verification link</li>
                <li>Try requesting a new verification email</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function EmailConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <EmailConfirmContent />
    </Suspense>
  )
}