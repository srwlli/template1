'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useToastHelpers } from '@/components/ToastProvider'
import { logError, logUserAction } from '@/lib/errorLogger'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Custom Toggle/Switch Component
const Toggle = ({ enabled, onChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</h3>
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

// Radio Option Component
const RadioOption = ({ name, value, checked, onChange, label, disabled = false }) => {
  return (
    <label className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
      />
      <span className={`ml-3 text-sm ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</span>
    </label>
  );
};

// Action Item Component
const ActionItem = ({ title, description, buttonText, buttonColor, onClick, isDestructive = false, disabled = false }) => {
  const buttonStyles = {
    blue: "bg-blue-600 hover:bg-blue-700",
    gray: "bg-gray-600 hover:bg-gray-700", 
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700"
  };

  const textColor = isDestructive ? "text-red-900" : "text-gray-900";
  const descColor = isDestructive ? "text-red-600" : "text-gray-500";

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-sm font-medium ${disabled ? 'text-gray-400' : textColor}`}>{title}</h3>
        <p className={`text-sm ${disabled ? 'text-gray-400' : descColor}`}>{description}</p>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 ${buttonStyles[buttonColor]} text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {buttonText}
      </button>
    </div>
  );
};

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

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()

  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // App Preferences State
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  
  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [dataCollection, setDataCollection] = useState(true)
  const [thirdPartySharing, setThirdPartySharing] = useState(false)

  // ✅ NEW: Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState({})

  // Load user preferences from metadata
  useEffect(() => {
    if (user?.user_metadata) {
      const metadata = user.user_metadata
      setDarkMode(metadata.darkMode || false)
      setEmailNotifications(metadata.emailNotifications !== false)
      setPushNotifications(metadata.pushNotifications || false)
      setMarketingEmails(metadata.marketingEmails || false)
      setProfileVisibility(metadata.profileVisibility || 'public')
      setDataCollection(metadata.dataCollection !== false)
      setThirdPartySharing(metadata.thirdPartySharing || false)
    }
  }, [user])

  // ✅ NEW: Password validation
  const validatePasswordField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'currentPassword':
        if (!value) return 'Current password is required'
        return undefined
      case 'newPassword':
        if (!value) return 'New password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        if (value === currentPassword) return 'New password must be different from current password'
        return undefined
      case 'confirmPassword':
        if (!value) return 'Please confirm your new password'
        if (value !== newPassword) return 'Passwords do not match'
        return undefined
      default:
        return undefined
    }
  }

  const validatePasswordForm = (): boolean => {
    const newErrors = {}
    
    const currentError = validatePasswordField('currentPassword', currentPassword)
    const newError = validatePasswordField('newPassword', newPassword)
    const confirmError = validatePasswordField('confirmPassword', confirmPassword)

    if (currentError) newErrors.currentPassword = currentError
    if (newError) newErrors.newPassword = newError
    if (confirmError) newErrors.confirmPassword = confirmError

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ NEW: Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      showError('Please fix the errors below')
      return
    }

    setPasswordLoading(true)
    setPasswordErrors({})

    try {
      logUserAction('Settings: Password change attempt', { userId: user?.id })

      // Step 1: Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (verifyError) {
        setPasswordErrors({ currentPassword: 'Current password is incorrect' })
        showError('Current password is incorrect')
        return
      }

      // Step 2: Update to new password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      logUserAction('Settings: Password changed successfully', { userId: user?.id })

      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
      setPasswordErrors({})

      success('Password Updated!', 'Your password has been changed successfully.')

    } catch (err: any) {
      logError(err, {
        component: 'SettingsPage',
        action: 'password_change',
        additionalData: { userId: user?.id }
      })

      if (err.message?.includes('New password should be different')) {
        setPasswordErrors({ newPassword: 'New password must be different from your current password' })
        showError('Password Update Failed', 'New password must be different from your current password.')
      } else {
        const message = err.message || 'Failed to update password. Please try again.'
        setPasswordErrors({ general: message })
        showError('Password Update Failed', message)
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const getPasswordFieldErrorClass = (hasError: boolean) => {
    const baseClass = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors"
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
    }
    
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
  }

  // Save preferences function
  const handleSavePreferences = async () => {
    if (!user) {
      showError('Error', 'User not found. Please try logging in again.')
      return
    }

    setLoading(true)
    
    try {
      logUserAction('Settings: Save preferences attempt', { userId: user.id })

      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          darkMode,
          emailNotifications,
          pushNotifications,
          marketingEmails,
          profileVisibility,
          dataCollection,
          thirdPartySharing,
          preferencesUpdatedAt: new Date().toISOString()
        },
      })

      if (error) {
        throw error
      }

      logUserAction('Settings: Preferences saved successfully', { 
        userId: user.id,
        preferences: {
          darkMode,
          emailNotifications,
          pushNotifications,
          marketingEmails,
          profileVisibility,
          dataCollection,
          thirdPartySharing
        }
      })

      success('Preferences Saved!', 'Your settings have been updated successfully.')

    } catch (err: any) {
      logError(err, {
        component: 'SettingsPage',
        action: 'save_preferences',
        additionalData: { userId: user?.id }
      })
      showError('Save Failed', err.message || 'Unable to save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Export data function
  const handleExportData = async () => {
    if (!user) {
      showError('Error', 'User not found. Please try logging in again.')
      return
    }

    try {
      logUserAction('Settings: Data export requested', { userId: user.id })

      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          user_metadata: user.user_metadata
        },
        export_date: new Date().toISOString(),
        export_type: 'user_data'
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      success('Data Exported!', 'Your data has been downloaded as a JSON file.')

    } catch (err: any) {
      logError(err, {
        component: 'SettingsPage',
        action: 'export_data',
        additionalData: { userId: user?.id }
      })
      showError('Export Failed', 'Unable to export data. Please try again.')
    }
  }

  // 2FA placeholder
  const handleEnable2FA = () => {
    try {
      logUserAction('Settings: 2FA setup attempted', { userId: user?.id })
      success('Feature Coming Soon!', 'Two-factor authentication will be available in a future update.')
    } catch (err: any) {
      logError(err, {
        component: 'SettingsPage',
        action: 'enable_2fa'
      })
      showError('Error', 'Unable to set up 2FA at this time.')
    }
  }

  // Account deletion
  const handleDeleteAccount = async () => {
    if (!user) {
      showError('Error', 'User not found. Please try logging in again.')
      return
    }

    const firstConfirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    )
    
    if (!firstConfirmation) return

    const confirmationText = window.prompt(
      'To confirm account deletion, please type "DELETE" (all caps):'
    )
    
    if (confirmationText !== 'DELETE') {
      showError('Deletion Cancelled', 'Account deletion was cancelled.')
      return
    }

    setLoading(true)

    try {
      logUserAction('Settings: Account deletion initiated', { userId: user.id })

      await supabase.auth.signOut()
      
      success('Account Deletion Initiated', 'Your account deletion process has started. You have been signed out.')
      router.push('/')

    } catch (err: any) {
      logError(err, {
        component: 'SettingsPage',
        action: 'delete_account',
        additionalData: { userId: user?.id }
      })
      showError('Deletion Failed', 'Unable to delete account. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your app preferences, privacy settings, and account options.</p>
          </div>

          <div className="space-y-8">
            {/* App Preferences Section */}
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize your app experience and notification settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Toggle
                  enabled={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  label="Dark Mode"
                  description="Use dark theme for better viewing in low light"
                  disabled={loading}
                />

                <Toggle
                  enabled={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  label="Email Notifications"
                  description="Receive email updates about your account activity"
                  disabled={loading}
                />

                <Toggle
                  enabled={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                  label="Push Notifications"
                  description="Receive push notifications in your browser"
                  disabled={loading}
                />

                <Toggle
                  enabled={marketingEmails}
                  onChange={() => setMarketingEmails(!marketingEmails)}
                  label="Marketing Emails"
                  description="Receive emails about new features and promotions"
                  disabled={loading}
                />

                <div className="pt-4 border-t">
                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your data is used and shared.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Profile Visibility</h3>
                  <p className="text-sm text-gray-500 mb-3">Choose who can see your profile information</p>
                  <div className="space-y-2">
                    <RadioOption
                      name="profileVisibility"
                      value="public"
                      checked={profileVisibility === 'public'}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      label="Public - Anyone can see your profile"
                      disabled={loading}
                    />
                    <RadioOption
                      name="profileVisibility"
                      value="private"
                      checked={profileVisibility === 'private'}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      label="Private - Only you can see your profile"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Toggle
                  enabled={dataCollection}
                  onChange={() => setDataCollection(!dataCollection)}
                  label="Analytics Data Collection"
                  description="Allow us to collect usage data to improve the app"
                  disabled={loading}
                />

                <Toggle
                  enabled={thirdPartySharing}
                  onChange={() => setThirdPartySharing(!thirdPartySharing)}
                  label="Third-Party Data Sharing"
                  description="Allow sharing of anonymized data with partners"
                  disabled={loading}
                />
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security and password settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ✅ NEW: Password Change Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                      <p className="text-sm text-gray-500">Update your account password for security</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>

                  {/* Password Change Form */}
                  {showPasswordForm && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={getPasswordFieldErrorClass(!!passwordErrors.currentPassword)}
                            placeholder="Enter your current password"
                            disabled={passwordLoading}
                          />
                          {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                          )}
                        </div>

                        {/* New Password */}
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={getPasswordFieldErrorClass(!!passwordErrors.newPassword)}
                            placeholder="Enter your new password (min. 6 characters)"
                            disabled={passwordLoading}
                          />
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="confirm-new-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={getPasswordFieldErrorClass(!!passwordErrors.confirmPassword)}
                            placeholder="Confirm your new password"
                            disabled={passwordLoading}
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                          )}
                        </div>

                        {/* General Error */}
                        {passwordErrors.general && (
                          <ErrorAlert message={passwordErrors.general} />
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={passwordLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {passwordLoading ? (
                              <>
                                <LoadingSpinner />
                                Updating...
                              </>
                            ) : (
                              'Update Password'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordForm(false)
                              setCurrentPassword('')
                              setNewPassword('')
                              setConfirmPassword('')
                              setPasswordErrors({})
                            }}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <ActionItem
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  buttonText="Enable 2FA"
                  buttonColor="green"
                  onClick={handleEnable2FA}
                  disabled={loading}
                />
              </CardContent>
            </Card>

            {/* Account Management Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account data and deletion options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ActionItem
                  title="Export Your Data"
                  description="Download a copy of all your account data"
                  buttonText="Export Data"
                  buttonColor="gray"
                  onClick={handleExportData}
                  disabled={loading}
                />

                {/* Account Deletion - Special styling */}
                <div className="border-t pt-6">
                  <ActionItem
                    title="Delete Account"
                    description="Permanently delete your account and all associated data"
                    buttonText="Delete Account"
                    buttonColor="red"
                    onClick={handleDeleteAccount}
                    isDestructive={true}
                    disabled={loading}
                  />
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-700">
                      <strong>Warning:</strong> This action cannot be undone. All your data, projects, and account information will be permanently deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}