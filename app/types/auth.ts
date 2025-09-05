export interface User {
  walletAddress?: string
  username?: string
  profilePictureUrl?: string
  permissions?: {
    notifications: boolean
    contacts: boolean
  }
  optedIntoOptionalAnalytics?: boolean
  worldAppVersion?: number
  deviceOS?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}
