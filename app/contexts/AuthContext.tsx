"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { User, AuthContextType } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user?.walletAddress

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if MiniKit is available
      if (!MiniKit.isInstalled()) {
        setUser(null)
        return
      }

      // Check if user is already authenticated via MiniKit
      if (MiniKit.walletAddress) {
        const userData: User = {
          walletAddress: MiniKit.walletAddress,
          username: MiniKit.user?.username,
          profilePictureUrl: MiniKit.user?.profilePictureUrl,
          permissions: MiniKit.user?.permissions,
          optedIntoOptionalAnalytics: MiniKit.user?.optedIntoOptionalAnalytics,
          worldAppVersion: MiniKit.user?.worldAppVersion,
          deviceOS: MiniKit.user?.deviceOS,
        }
        setUser(userData)
      } else {
        // Check if we have a stored session on the server
        try {
          const response = await fetch('/api/check-session', {
            method: 'GET',
            credentials: 'include'
          })
          
          if (response.ok) {
            const sessionData = await response.json()
            if (sessionData.isValid && sessionData.address) {
              const userData: User = {
                walletAddress: sessionData.address,
                username: sessionData.username,
                profilePictureUrl: sessionData.profilePictureUrl,
                permissions: sessionData.permissions,
                optedIntoOptionalAnalytics: sessionData.optedIntoOptionalAnalytics,
                worldAppVersion: sessionData.worldAppVersion,
                deviceOS: sessionData.deviceOS,
              }
              setUser(userData)
            } else {
              setUser(null)
            }
          } else {
            setUser(null)
          }
        } catch (sessionError) {
          console.log('No valid session found')
          setUser(null)
        }
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setError('Failed to check authentication status')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!MiniKit.isInstalled()) {
        throw new Error('World App is not installed')
      }

      // Get nonce from backend
      const res = await fetch('/api/nonce')
      if (!res.ok) {
        throw new Error('Failed to get nonce')
      }
      const { nonce } = await res.json()

      // Trigger wallet authentication
      const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        statement: 'Sign in to Worldcoin Withdraw App to access your withdrawal services',
      })

      if (finalPayload.status === 'error') {
        throw new Error('Authentication failed')
      }

      // Verify the signature with backend
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const verifyResult = await verifyResponse.json()

      if (!verifyResult.isValid) {
        throw new Error(verifyResult.message || 'Authentication verification failed')
      }

      // Update user state with verified data
      const userData: User = {
        walletAddress: finalPayload.address,
        username: MiniKit.user?.username,
        profilePictureUrl: MiniKit.user?.profilePictureUrl,
        permissions: MiniKit.user?.permissions,
        optedIntoOptionalAnalytics: MiniKit.user?.optedIntoOptionalAnalytics,
        worldAppVersion: MiniKit.user?.worldAppVersion,
        deviceOS: MiniKit.user?.deviceOS,
      }
      setUser(userData)

      // Update server session with user data
      try {
        await fetch('/api/update-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: finalPayload.address,
            username: MiniKit.user?.username,
            profilePictureUrl: MiniKit.user?.profilePictureUrl,
            permissions: MiniKit.user?.permissions,
            optedIntoOptionalAnalytics: MiniKit.user?.optedIntoOptionalAnalytics,
            worldAppVersion: MiniKit.user?.worldAppVersion,
            deviceOS: MiniKit.user?.deviceOS,
          }),
        })
      } catch (updateError) {
        console.error('Failed to update session data:', updateError)
        // Don't fail the login if session update fails
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Call logout API to clear server-side session
      await fetch('/api/logout', {
        method: 'POST',
      })

      // Clear local state
      setUser(null)
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError(err.message || 'Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Listen for MiniKit state changes
  useEffect(() => {
    const handleMiniKitChange = () => {
      checkAuth()
    }

    // Listen for MiniKit events if available
    if (typeof window !== 'undefined' && window.MiniKit) {
      // Check if MiniKit has event listeners
      if (window.MiniKit.on) {
        window.MiniKit.on('walletAddressChanged', handleMiniKitChange)
        window.MiniKit.on('userChanged', handleMiniKitChange)
      }
    }

    // Also check periodically for changes (fallback)
    const interval = setInterval(() => {
      if (MiniKit.isInstalled() && MiniKit.walletAddress && !user?.walletAddress) {
        checkAuth()
      }
    }, 5000) // Check every 5 seconds

    return () => {
      if (typeof window !== 'undefined' && window.MiniKit && window.MiniKit.off) {
        window.MiniKit.off('walletAddressChanged', handleMiniKitChange)
        window.MiniKit.off('userChanged', handleMiniKitChange)
      }
      clearInterval(interval)
    }
  }, [user?.walletAddress])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
