// Tipos principales para el dominio de retiros
export interface WithdrawalData {
  amount: string
  destination: string
  personalData: PersonalData
  status?: WithdrawalStatus
  transactionId?: string
  createdAt?: Date
  processedAt?: Date
}

export interface PersonalData {
  fullName: string
  birthDate: string
  email: string
  phoneNumber: string
}

export type WithdrawalStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'

export interface Destination {
  id: string
  name: string
  type: 'bank' | 'nequi' | 'daviplata'
  processingTime: string
  description: string
  icon: string
  isAvailable: boolean
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

export interface WithdrawalRequest {
  amount: number
  destination: string
  personalData: PersonalData
  userId?: string
  walletAddress?: string
}

export interface WithdrawalResponse {
  success: boolean
  transactionId?: string
  message?: string
  error?: string
}

// Tipos para el contexto
export interface WithdrawalContextType {
  withdrawalData: WithdrawalData
  currentStep: number
  isLoading: boolean
  error: string | null
  updateAmount: (amount: string) => void
  updateDestination: (destination: string) => void
  updatePersonalData: (data: Partial<PersonalData>) => void
  setCurrentStep: (step: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetWithdrawal: () => void
  submitWithdrawal: () => Promise<void>
}
