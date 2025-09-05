"use client"

import { WithdrawalProvider } from "./contexts/WithdrawalContext"
import WithdrawalApp from "./views/WithdrawalApp"
import ProtectedRoute from "../components/ProtectedRoute"
import Header from "../components/withdrawal/Header"

export default function Page() {
  return (
    <ProtectedRoute>
      <WithdrawalProvider>
        <div className="h-full flex flex-col">
          <Header />
          <WithdrawalApp />
        </div>
      </WithdrawalProvider>
    </ProtectedRoute>
  )
}