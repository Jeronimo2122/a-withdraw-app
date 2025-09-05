"use client"

import { useAuth } from '../../app/contexts/AuthContext'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, User, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

export default function Header({ title = "Worldcoin Withdraw", showBackButton = false, onBack }: HeaderProps) {
  const { user, isAuthenticated, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getInitials = (username?: string) => {
    if (!username) return 'U'
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatAddress = (address?: string) => {
    if (!address) return 'No wallet'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              ←
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3">
            {/* User Info Display */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">{user.username || 'Usuario'}</span>
              <Wallet className="w-4 h-4" />
              <span className="font-mono text-xs">{formatAddress(user.walletAddress)}</span>
            </div>
            
            {/* User Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePictureUrl} alt={user.username} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/signin')}
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </header>
  )
}