"use client"

import { WithdrawalProvider } from "./contexts/WithdrawalContext"
import WithdrawalApp from "./views/WithdrawalApp"
import ProtectedRoute from "../components/ProtectedRoute"

export default function Page() {
  return (
    <ProtectedRoute>
      <WithdrawalProvider>
        <div className="h-full flex flex-col">
          <WithdrawalApp />
        </div>
      </WithdrawalProvider>
    </ProtectedRoute>
  )
}