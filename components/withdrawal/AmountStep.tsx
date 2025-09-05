"use client"

import { useState } from "react"
import { useWithdrawal } from "@/contexts/WithdrawalContext"
import Header from "./Header"
import { Button } from "@/components/ui/button"

interface AmountStepProps {
  onNext: () => void
}

export default function AmountStep({ onNext }: AmountStepProps) {
  const { withdrawalData, updateAmount } = useWithdrawal()
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
  }

  const handleContinue = () => {
    updateAmount(amount)
    onNext()
  }

  const exchangeRate = 2860
  const equivalentAmount = (parseFloat(amount) || 0) * exchangeRate

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Retirar" />
      
      <div className="px-4 py-6">
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
