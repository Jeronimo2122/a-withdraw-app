import { useState, useCallback, useEffect } from 'react'
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'
import { useToast } from '@/components/ui/use-toast'

interface VerificationOptions {
  actionId?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  persistVerification?: boolean
}

interface VerificationState {
  isVerified: boolean
  isLoading: boolean
  error: string | null
}

export const useWorldIDVerification = (options: VerificationOptions = {}) => {
  const { toast } = useToast()
  const [state, setState] = useState<VerificationState>(() => {
    if (typeof window !== 'undefined' && options.persistVerification !== false) {
      const stored = localStorage.getItem('worldIdVerified')
      return {
        isVerified: stored === 'true',
        isLoading: false,
        error: null
      }
    }
    return {
      isVerified: false,
      isLoading: false,
      error: null
    }
  })

  useEffect(() => {
    if (options.persistVerification === false) {
      clearVerification()
    }
  }, [options.persistVerification])

  const clearVerification = useCallback(() => {
    setState(prev => ({ ...prev, isVerified: false, error: null }))
    if (typeof window !== 'undefined') {
      localStorage.removeItem('worldIdVerified')
    }
  }, [])

  const triggerVerification = useCallback(async (characterName: string): Promise<boolean> => {
    if (state.isVerified) return true

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const verifyPayload: VerifyCommandInput = {
      action: options.actionId || process.env.APP_VERIFY || 'app_verify',
      signal: `chat-${characterName}-${Date.now()}`,
      verification_level: VerificationLevel.Device,
    }

    try {
      if (typeof window === 'undefined') {
        throw new Error('Verification can only be performed in the browser')
      }

      if (!MiniKit.isInstalled()) {
        throw new Error('World App not detected. Please open this app in the World App')
      }

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === 'error') {
        console.error('Verification error details:', {
          status: finalPayload.status,
          error: finalPayload,
          payload: verifyPayload
        })
        throw new Error('Verification failed. Please try again')
      }

      const verifyResponse = await fetch('/api/chat/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        console.error('Backend verification failed:', errorData)
        
        let errorMessage = "Could not verify identity"
        if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.verifyRes?.error) {
          errorMessage = errorData.verifyRes.error
        }

        throw new Error(errorMessage)
      }

      const result = await verifyResponse.json()

      if (result.status === 200) {
        setState(prev => ({ ...prev, isVerified: true, isLoading: false }))
        if (typeof window !== 'undefined' && options.persistVerification !== false) {
          localStorage.setItem('worldIdVerified', 'true')
        }
        options.onSuccess?.()
        return true
      } else {
        throw new Error(result.error || "Could not verify identity")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification process failed'
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      options.onError?.(errorMessage)
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }, [options, state.isVerified, toast])

  return {
    ...state,
    triggerVerification,
    clearVerification
  }
} 