'use client'

import { useState, useEffect } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    wasOffline: false
  })

  useEffect(() => {
    setNetworkStatus({
      isOnline: navigator.onLine,
      wasOffline: false
    })

    const handleOnline = () => {
      setNetworkStatus(prev => ({
        isOnline: true,
        wasOffline: !prev.isOnline
      }))
    }

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return networkStatus
}