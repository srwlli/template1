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