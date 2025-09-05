// Constantes de la aplicación
export const EXCHANGE_RATES = {
  EUR_TO_USD: 2860,
  DEFAULT_CURRENCY: 'EUR',
  TARGET_CURRENCY: 'USD'
} as const

export const WITHDRAWAL_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 10000,
  DEFAULT_AMOUNT: 10
} as const

export const PROCESSING_TIMES = {
  BANK: 'Hasta 1 día',
  NEQUI: 'Instantáneo',
  DAVIPLATA: 'Instantáneo'
} as const

export const DESTINATION_TYPES = {
  BANK: 'bank',
  NEQUI: 'nequi',
  DAVIPLATA: 'daviplata'
} as const

export const WITHDRAWAL_STEPS = {
  AMOUNT: 1,
  DESTINATION: 2,
  DATA: 3,
  CONFIRMATION: 4
} as const

export const API_ENDPOINTS = {
  EXCHANGE_RATES: '/api/exchange-rates',
  DESTINATIONS: '/api/destinations',
  VALIDATE_WITHDRAWAL: '/api/withdrawal/validate',
  PROCESS_WITHDRAWAL: '/api/withdrawal/process',
  WITHDRAWAL_STATUS: '/api/withdrawal/status'
} as const

export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'El monto debe ser un número válido entre €1 y €10,000',
  DESTINATION_REQUIRED: 'Debe seleccionar un destino para el retiro',
  INVALID_EMAIL: 'El correo electrónico no es válido',
  INVALID_PHONE: 'El número de celular no es válido',
  REQUIRED_FIELD: 'Este campo es requerido',
  NETWORK_ERROR: 'Error de conexión. Por favor intenta de nuevo.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado'
} as const
