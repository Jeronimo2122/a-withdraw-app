import { NextRequest, NextResponse } from 'next/server'
import { validateAmount, validatePersonalData } from '../../utils/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, destination, personalData } = body

    const errors: string[] = []

    // Validar monto
    const amountValidation = validateAmount(amount.toString())
    if (!amountValidation.valid) {
      errors.push(amountValidation.error!)
    }

    // Validar destino
    if (!destination) {
      errors.push('Debe seleccionar un destino')
    }

    // Validar datos personales
    if (personalData) {
      const personalDataValidation = validatePersonalData(personalData)
      if (!personalDataValidation.valid) {
        errors.push(...personalDataValidation.errors)
      }
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors
    })
  } catch (error) {
    return NextResponse.json(
      { valid: false, errors: ['Error de validación'] },
      { status: 400 }
    )
  }
}
