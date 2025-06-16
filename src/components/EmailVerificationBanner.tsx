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