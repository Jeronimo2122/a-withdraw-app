"use client"

import { useState, useEffect } from 'react'
import { ExchangeRate } from '../types/withdrawal'
import { withdrawalService } from '../services/withdrawalService'

export function useExchangeRate() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const rates = await withdrawalService.getExchangeRates()
        setExchangeRates(rates)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching exchange rates')
        // Fallback a tasa estática
        setExchangeRates([{
          from: 'EUR',
          to: 'USD',
          rate: 2860,
          lastUpdated: new Date()
        }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRates()
  }, [])

  const getRate = (from: string, to: string): number => {
    const rate = exchangeRates.find(r => r.from === from && r.to === to)
    return rate?.rate || 2860 // Fallback
  }

  const convertAmount = (amount: number, from: string, to: string): number => {
    const rate = getRate(from, to)
    return amount * rate
  }

  return {
    exchangeRates,
    isLoading,
    error,
    getRate,
    convertAmount
  }
}
