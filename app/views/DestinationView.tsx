"use client"

import { useState, useEffect } from "react"
import { useWithdrawal } from '../hooks/useWithdrawal'
import { useDestinations } from '../hooks/useDestinations'
import Header from '../../components/withdrawal/Header'
import { Button } from "@/components/ui/button"
import { Building2, Check } from "lucide-react"

interface DestinationViewProps {
  onNext: () => void
  onBack: () => void
}

export default function DestinationView({ onNext, onBack }: DestinationViewProps) {
  const { withdrawalData, updateDestination, error, setError } = useWithdrawal()
  const { destinations, isLoading, getDestinationById } = useDestinations()
  const [selectedDestination, setSelectedDestination] = useState(withdrawalData.destination || "")

  useEffect(() => {
    if (withdrawalData.destination) {
      setSelectedDestination(withdrawalData.destination)
    }
  }, [withdrawalData.destination])

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId)
    updateDestination(destinationId)
    setError(null) // Clear error when user selects
  }

  const handleContinue = () => {
    if (!selectedDestination) {
      setError('Debe seleccionar un destino')
      return
    }
    onNext()
  }

  const getDestinationIcon = (destination: any) => {
    switch (destination.type) {
      case 'bank':
        return Building2
      case 'nequi':
        return () => (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
        )
      case 'daviplata':
        return () => (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
        )
      default:
        return Building2
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header title="Destino" showBack onBack={onBack} />
        <div className="px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando destinos...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Destino" showBack onBack={onBack} />
      
      <div className="px-4 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Selecciona el destino del retiro:
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {destinations.map((destination) => {
            const IconComponent = getDestinationIcon(destination)
            const isSelected = selectedDestination === destination.id
            
            return (
              <div
                key={destination.id}
                className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDestinationSelect(destination.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {destination.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {destination.processingTime}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedDestination}
          className="w-full h-14 bg-[#2C2C2E] text-white text-lg font-semibold rounded-2xl hover:bg-[#1C1C1E] disabled:bg-gray-300"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
