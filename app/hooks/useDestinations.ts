"use client"

import { useState, useEffect } from 'react'
import { Destination } from '../types/withdrawal'
import { withdrawalService } from '../services/withdrawalService'

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const dests = await withdrawalService.getDestinations()
        setDestinations(dests)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching destinations')
        // Fallback a destinos estáticos
        setDestinations([
          {
            id: 'bank',
            name: 'Cuenta bancaria',
            type: 'bank',
            processingTime: 'Hasta 1 día',
            description: 'Transferencia bancaria tradicional',
            icon: 'building',
            isAvailable: true
          },
          {
            id: 'nequi',
            name: 'Nequi',
            type: 'nequi',
            processingTime: 'Instantáneo',
            description: 'Transferencia instantánea',
            icon: 'nequi',
            isAvailable: true
          },
          {
            id: 'daviplata',
            name: 'Daviplata',
            type: 'daviplata',
            processingTime: 'Instantáneo',
            description: 'Transferencia instantánea',
            icon: 'daviplata',
            isAvailable: true
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const getDestinationById = (id: string): Destination | undefined => {
    return destinations.find(dest => dest.id === id)
  }

  const getAvailableDestinations = (): Destination[] => {
    return destinations.filter(dest => dest.isAvailable)
  }

  return {
    destinations,
    isLoading,
    error,
    getDestinationById,
    getAvailableDestinations
  }
}
