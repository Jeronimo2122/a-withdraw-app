"use client"

import { useWithdrawal } from '../hooks/useWithdrawal'
import { useExchangeRate } from '../hooks/useExchangeRate'
import { useDestinations } from '../hooks/useDestinations'
import Header from '../../components/withdrawal/Header'
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle } from "lucide-react"

interface ConfirmationViewProps {
  onBack: () => void
}

export default function ConfirmationView({ onBack }: ConfirmationViewProps) {
  const { withdrawalData, submitWithdrawal, isLoading, error } = useWithdrawal()
  const { convertAmount } = useExchangeRate()
  const { getDestinationById } = useDestinations()
  
  const equivalentAmount = convertAmount(parseFloat(withdrawalData.amount) || 0, 'EUR', 'USD')
  const destination = getDestinationById(withdrawalData.destination)

  const handleWithdraw = async () => {
    await submitWithdrawal()
  }

  const getDestinationIcon = (destination: any) => {
    if (!destination) return Building2
    
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

  const IconComponent = destination ? getDestinationIcon(destination) : Building2

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Confirmación" showBack onBack={onBack} />
      
      <div className="px-4 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Retirar de Worldcoin</span>
              <span className="font-semibold text-lg">€ {withdrawalData.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recibe en tu cuenta</span>
              <span className="font-semibold text-lg">${equivalentAmount.toLocaleString()}.00</span>
            </div>
            <div className="text-center text-sm text-gray-500 pt-2 border-t">
              € 1 = $2,860.00
            </div>
          </div>
        </div>

        {/* Destination Details */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <IconComponent />
            <div>
              <h3 className="font-semibold text-gray-900">
                {destination?.name || 'Destino seleccionado'}
              </h3>
              <p className="text-sm text-gray-600">
                {destination?.processingTime || 'Tiempo de procesamiento'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div>312 345 6789</div>
            <div>{withdrawalData.personalData.fullName}</div>
            <div>{withdrawalData.personalData.email}</div>
          </div>
        </div>

        {/* Processing Info */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                El retiro llegará a tu cuenta en aprox. 5 minutos.
              </p>
              <p>
                Al correo proporcionado llegará el recibo.
              </p>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={isLoading}
          className="w-full h-14 bg-[#2C2C2E] text-white text-lg font-semibold rounded-2xl hover:bg-[#1C1C1E] disabled:bg-gray-300"
        >
          {isLoading ? 'Procesando...' : 'Efectuar retiro'}
        </Button>
      </div>
    </div>
  )
}
