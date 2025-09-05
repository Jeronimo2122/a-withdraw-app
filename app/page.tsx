"use client"

import { WithdrawalProvider } from "@/contexts/WithdrawalContext"
import WithdrawalApp from "./views/WithdrawalApp"

export default function Page() {
  return (
    <WithdrawalProvider>
      <WithdrawalApp />
    </WithdrawalProvider>
  )
}