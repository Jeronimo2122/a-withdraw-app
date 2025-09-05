"use client"

import { createContext, useContext, ReactNode } from "react"
import { useWithdrawal as useWithdrawalHook } from "../hooks/useWithdrawal"
import { WithdrawalContextType } from "../types/withdrawal"

const WithdrawalContext = createContext<WithdrawalContextType | undefined>(undefined)

export function WithdrawalProvider({ children }: { children: ReactNode }) {
  const withdrawalHook = useWithdrawalHook()

  return (
    <WithdrawalContext.Provider value={withdrawalHook}>
      {children}
    </WithdrawalContext.Provider>
  )
}

export function useWithdrawal() {
  const context = useContext(WithdrawalContext)
  if (context === undefined) {
    throw new Error('useWithdrawal must be used within a WithdrawalProvider')
  }
  return context
}
