"use client"

import { useState } from "react"
import { useWithdrawal } from '../hooks/useWithdrawal'
import { useExchangeRate } from '../hooks/useExchangeRate'
import Header from '../../components/withdrawal/Header'
import { Button } from "@/components/ui/button"

interface AmountViewProps {
  onNext: () => void
}

export default function AmountView({ onNext }: AmountViewProps) {
  const { withdrawalData, updateAmount, error, setError } = useWithdrawal()
  const { convertAmount } = useExchangeRate()
  const [amount, setAmount] = useState(withdrawalData.amount || "10")

  const handleNumberClick = (number: string) => {
    if (number === "backspace") {
      setAmount(prev => prev.slice(0, -1))
    } else if (number === ".") {
      if (!amount.includes(".")) {
        setAmount(prev => prev + ".")
      }
    } else {
      setAmount(prev => prev + number)
    }
    setError(null) // Clear error when user types
  }

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }
    
    updateAmount(amount)
    onNext()
  }

  const equivalentAmount = convertAmount(parseFloat(amount) || 0, 'EUR', 'USD')

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Retirar" />
      
      <div className="px-4 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Amount Display */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              € {amount || "0"}
            </div>
            <div className="text-lg text-gray-600">
              ${equivalentAmount.toLocaleString()}.00
            </div>
            <div className="text-sm text-gray-500 mt-2">
              € 1 = $2,860.00
            </div>
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((number) => (
            <Button
              key={number}
              variant="outline"
              className="h-16 text-xl font-semibold bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-16 text-xl font-semibold bg-white border-gray-200 hover:bg-gray-50"
            onClick={() => handleNumberClick(".")}
          >
            .
          </Button>
          <Button
            variant="outline"
            className="h-16 text-xl font-semibold bg-white border-gray-200 hover:bg-gray-50"
            onClick={() => handleNumberClick("0")}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="h-16 text-xl font-semibold bg-white border-gray-200 hover:bg-gray-50"
            onClick={() => handleNumberClick("backspace")}
          >
            ⌫
          </Button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full h-14 bg-[#2C2C2E] text-white text-lg font-semibold rounded-2xl hover:bg-[#1C1C1E] disabled:bg-gray-300"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
