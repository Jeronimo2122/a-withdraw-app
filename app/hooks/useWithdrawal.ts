"use client"

import { useState, useCallback } from 'react'
import { WithdrawalData, PersonalData, WithdrawalContextType } from '../types/withdrawal'
import { withdrawalService } from '../services/withdrawalService'
import { useAuth } from '../contexts/AuthContext'

const defaultWithdrawalData: WithdrawalData = {
  amount: "",
  destination: "",
  personalData: {
    fullName: "",
    birthDate: "",
    email: "",
    phoneNumber: ""
  },
  status: 'pending'
}

export function useWithdrawal(): WithdrawalContextType {
  const { user } = useAuth()
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>(defaultWithdrawalData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateAmount = useCallback((amount: string) => {
    setWithdrawalData(prev => ({ ...prev, amount }))
    setError(null)
  }, [])

  const updateDestination = useCallback((destination: string) => {
    setWithdrawalData(prev => ({ ...prev, destination }))
    setError(null)
  }, [])

  const updatePersonalData = useCallback((data: Partial<PersonalData>) => {
    setWithdrawalData(prev => ({
      ...prev,
      personalData: { ...prev.personalData, ...data }
    }))
    setError(null)
  }, [])

  const resetWithdrawal = useCallback(() => {
    setWithdrawalData(defaultWithdrawalData)
    setCurrentStep(1)
    setError(null)
    setIsLoading(false)
  }, [])

  const submitWithdrawal = useCallback(async () => {
    if (!withdrawalData.amount || !withdrawalData.destination) {
      setError('Datos incompletos para procesar el retiro')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Validar datos antes de enviar
      const validation = await withdrawalService.validateWithdrawal({
        amount: parseFloat(withdrawalData.amount),
        destination: withdrawalData.destination,
        personalData: withdrawalData.personalData
      })

      if (!validation.valid) {
        setError(validation.errors.join(', '))
        return
      }

      // Procesar retiro
      const result = await withdrawalService.processWithdrawal({
        amount: parseFloat(withdrawalData.amount),
        destination: withdrawalData.destination,
        personalData: withdrawalData.personalData,
        walletAddress: user?.walletAddress
      })

      if (result.success) {
        setWithdrawalData(prev => ({
          ...prev,
          transactionId: result.transactionId,
          status: 'processing'
        }))
        setCurrentStep(4) // Ir a confirmación
      } else {
        setError(result.error || 'Error al procesar el retiro')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [withdrawalData])

  return {
    withdrawalData,
    currentStep,
    isLoading,
    error,
    updateAmount,
    updateDestination,
    updatePersonalData,
    setCurrentStep,
    setLoading: setIsLoading,
    setError,
    resetWithdrawal,
    submitWithdrawal
  }
}
