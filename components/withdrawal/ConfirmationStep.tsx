"use client"

import { useWithdrawal } from "@/contexts/WithdrawalContext"
import Header from "./Header"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle } from "lucide-react"

interface ConfirmationStepProps {
  onBack: () => void
}

const destinationInfo = {
  bank: {
    name: "Cuenta Bancaria",
    icon: Building2,
    details: "Transferencia bancaria tradicional"
  },
  nequi: {
    name: "Cuenta Nequi",
    icon: () => (
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">N</span>
      </div>
    ),
    details: "312 345 6789"
  },
  daviplata: {
    name: "Cuenta Daviplata",
    icon: () => (
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">D</span>
      </div>
    ),
    details: "312 345 6789"
  }
}

export default function ConfirmationStep({ onBack }: ConfirmationStepProps) {
  const { withdrawalData } = useWithdrawal()
  
  const exchangeRate = 2860
  const equivalentAmount = (parseFloat(withdrawalData.amount) || 0) * exchangeRate
  const destination = destinationInfo[withdrawalData.destination as keyof typeof destinationInfo]

  const handleWithdraw = () => {
    // Here you would implement the actual withdrawal logic
    console.log("Processing withdrawal:", withdrawalData)
    // For now, just show success
    alert("¡Retiro procesado exitosamente!")
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Confirmación" showBack onBack={onBack} />
      
      <div className="px-4 py-6">
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
            {destination && <destination.icon />}
            <div>
              <h3 className="font-semibold text-gray-900">{destination?.name}</h3>
              <p className="text-sm text-gray-600">{destination?.details}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div>312 345 6789</div>
            <div>Sophia Jones</div>
            <div>sophiajones@mail.com</div>
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
          className="w-full h-14 bg-[#2C2C2E] text-white text-lg font-semibold rounded-2xl hover:bg-[#1C1C1E]"
        >
          Efectuar retiro
        </Button>
      </div>
    </div>
  )
}
