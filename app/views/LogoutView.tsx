"use client"

import { useAuth } from '../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Loader2, LogOut, User, Wallet } from 'lucide-react'

export default function LogoutView() {
  const { user, signOut, isLoading, error } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Cerrar Sesión
          </CardTitle>
          <CardDescription className="text-gray-600">
            ¿Estás seguro de que quieres cerrar tu sesión?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">Nombre de usuario</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {user.walletAddress ? 
                      `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                      'No disponible'
                    }
                  </p>
                  <p className="text-xs text-gray-500">Dirección de wallet</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleSignOut}
              disabled={isLoading}
              variant="destructive"
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Cerrando sesión...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 mr-2" />
                  Cerrar Sesión
                </>
              )}
            </Button>

            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full h-12 text-lg"
              size="lg"
            >
              Cancelar
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al cerrar sesión, tendrás que volver a autenticarte para acceder a tus servicios
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
