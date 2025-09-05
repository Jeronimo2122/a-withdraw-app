import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, destination, personalData } = body

    // Simular procesamiento del retiro
    // En producción, aquí se integraría con servicios de pago reales
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simular delay

    // Generar ID de transacción simulado
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Simular éxito/fallo (90% éxito)
    const success = Math.random() > 0.1

    if (success) {
      return NextResponse.json({
        success: true,
        transactionId,
        message: 'Retiro procesado exitosamente'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Error al procesar el retiro. Por favor intenta de nuevo.'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
