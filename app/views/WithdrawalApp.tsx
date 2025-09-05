"use client"

import { useWithdrawal } from '../hooks/useWithdrawal'
import AmountView from './AmountView'
import DestinationView from './DestinationView'
import DataView from './DataView'
import ConfirmationView from './ConfirmationView'

export default function WithdrawalApp() {
  const { currentStep, setCurrentStep } = useWithdrawal()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AmountView onNext={() => setCurrentStep(2)} />
      case 2:
        return <DestinationView onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
      case 3:
        return <DataView onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
      case 4:
        return <ConfirmationView onBack={() => setCurrentStep(3)} />
      default:
        return <AmountView onNext={() => setCurrentStep(2)} />
    }
  }

  return (
    <div className="flex-1 bg-[#F5F5F5]">
      {renderStep()}
    </div>
  )
}
