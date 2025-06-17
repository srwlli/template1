'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Custom Toggle/Switch Component
const Toggle = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
const RadioOption = ({ name, value, checked, onChange, label }) => {
  return (
    <label className="flex items-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <span className="ml-3 text-sm text-gray-900">{label}</span>
    </label>
  );
};

// Action Item Component
const ActionItem = ({ title, description, buttonText, buttonColor, onClick, isDestructive = false }) => {
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
        <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
        <p className={`text-sm ${descColor}`}>{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`px-4 py-2 ${buttonStyles[buttonColor]} text-white text-sm font-medium rounded-md transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default function SettingsPage() {
  // App Preferences State
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  
  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [dataCollection, setDataCollection] = useState(true)
  const [thirdPartySharing, setThirdPartySharing] = useState(false)

  const handleSavePreferences = () => {
    alert('Preferences saved successfully!')
  }

  const handleExportData = () => {
    alert('Data export has been initiated. You will receive an email with your data shortly.')
  }

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (confirmation) {
      alert('Account deletion process initiated. Please check your email for confirmation.')
    }
  }

  return (
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
              />

              <Toggle
                enabled={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                label="Email Notifications"
                description="Receive email updates about your account activity"
              />

              <Toggle
                enabled={pushNotifications}
                onChange={() => setPushNotifications(!pushNotifications)}
                label="Push Notifications"
                description="Receive push notifications in your browser"
              />

              <Toggle
                enabled={marketingEmails}
                onChange={() => setMarketingEmails(!marketingEmails)}
                label="Marketing Emails"
                description="Receive emails about new features and promotions"
              />

              <div className="pt-4 border-t">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Save Preferences
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
              {/* Profile Visibility */}
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
                  />
                  <RadioOption
                    name="profileVisibility"
                    value="private"
                    checked={profileVisibility === 'private'}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                    label="Private - Only you can see your profile"
                  />
                </div>
              </div>

              <Toggle
                enabled={dataCollection}
                onChange={() => setDataCollection(!dataCollection)}
                label="Analytics Data Collection"
                description="Allow us to collect usage data to improve the app"
              />

              <Toggle
                enabled={thirdPartySharing}
                onChange={() => setThirdPartySharing(!thirdPartySharing)}
                label="Third-Party Data Sharing"
                description="Allow sharing of anonymized data with partners"
              />
            </CardContent>
          </Card>

          {/* Account Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account data and security options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ActionItem
                title="Export Your Data"
                description="Download a copy of all your account data"
                buttonText="Export Data"
                buttonColor="gray"
                onClick={handleExportData}
              />

              <ActionItem
                title="Change Password"
                description="Update your account password for security"
                buttonText="Change Password"
                buttonColor="blue"
                onClick={() => alert('Password change functionality would go here')}
              />

              <ActionItem
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                buttonText="Enable 2FA"
                buttonColor="green"
                onClick={() => alert('2FA setup would go here')}
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
  )
}