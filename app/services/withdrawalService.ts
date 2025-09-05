import { WithdrawalRequest, WithdrawalResponse, ExchangeRate, Destination } from '../types/withdrawal'

// Servicio para comunicación con el backend
export class WithdrawalService {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl
  }

  // Obtener tipos de cambio actuales
  async getExchangeRates(): Promise<ExchangeRate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/exchange-rates`)
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      // Fallback a datos estáticos
      return [{
        from: 'EUR',
        to: 'USD',
        rate: 2860,
        lastUpdated: new Date()
      }]
    }
  }

  // Obtener destinos disponibles
  async getDestinations(): Promise<Destination[]> {
    try {
      const response = await fetch(`${this.baseUrl}/destinations`)
      if (!response.ok) {
        throw new Error('Failed to fetch destinations')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching destinations:', error)
      // Fallback a datos estáticos
      return [
        {
          id: 'bank',
          name: 'Cuenta bancaria',
          type: 'bank',
          processingTime: 'Hasta 1 día',
          description: 'Transferencia bancaria tradicional',
          icon: 'building',
          isAvailable: true
        },
        {
          id: 'nequi',
          name: 'Nequi',
          type: 'nequi',
          processingTime: 'Instantáneo',
          description: 'Transferencia instantánea',
          icon: 'nequi',
          isAvailable: true
        },
        {
          id: 'daviplata',
          name: 'Daviplata',
          type: 'daviplata',
          processingTime: 'Instantáneo',
          description: 'Transferencia instantánea',
          icon: 'daviplata',
          isAvailable: true
        }
      ]
    }
  }

  // Validar datos del retiro
  async validateWithdrawal(data: Partial<WithdrawalRequest>): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/withdrawal/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Validation failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error validating withdrawal:', error)
      // Validación básica en cliente
      return this.validateWithdrawalClient(data)
    }
  }

  // Procesar retiro
  async processWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/withdrawal/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to process withdrawal')
      }

      return await response.json()
    } catch (error) {
      console.error('Error processing withdrawal:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Obtener estado del retiro
  async getWithdrawalStatus(transactionId: string): Promise<WithdrawalResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/withdrawal/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch withdrawal status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching withdrawal status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Validación básica en cliente
  private validateWithdrawalClient(data: Partial<WithdrawalRequest>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.amount || data.amount <= 0) {
      errors.push('El monto debe ser mayor a 0')
    }

    if (!data.destination) {
      errors.push('Debe seleccionar un destino')
    }

    if (!data.personalData?.fullName) {
      errors.push('El nombre completo es requerido')
    }

    if (!data.personalData?.email) {
      errors.push('El correo electrónico es requerido')
    } else if (!this.isValidEmail(data.personalData.email)) {
      errors.push('El correo electrónico no es válido')
    }

    if (!data.personalData?.phoneNumber) {
      errors.push('El número de teléfono es requerido')
    }

    if (!data.personalData?.birthDate) {
      errors.push('La fecha de nacimiento es requerida')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private getAuthToken(): string {
    // Implementar lógica para obtener token de autenticación
    return localStorage.getItem('authToken') || ''
  }
}

// Instancia singleton del servicio
export const withdrawalService = new WithdrawalService()
