"use client"

import { useAuth } from '../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Loader2, Wallet, Shield, CheckCircle } from 'lucide-react'

export default function SignInView() {
  const { signIn, isLoading, error } = useAuth()

  const handleSignIn = async () => {
    await signIn()
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bienvenido a Worldcoin Withdraw
          </CardTitle>
          <CardDescription className="text-gray-600">
            Conecta tu wallet para acceder a los servicios de retiro
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Autenticación segura con tu wallet</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Sin necesidad de contraseñas</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Wallet className="w-5 h-5 text-green-500" />
              <span>Acceso directo a tus fondos</span>
            </div>
          </div>

          <Button 
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Conectar con World App
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
