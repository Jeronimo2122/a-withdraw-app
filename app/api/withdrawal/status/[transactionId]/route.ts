import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params

    // En producción, esto vendría de una base de datos
    // Simular diferentes estados basados en el ID
    const statuses = ['pending', 'processing', 'completed', 'failed']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return NextResponse.json({
      success: true,
      transactionId,
      status: randomStatus,
      message: `Estado del retiro: ${randomStatus}`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener el estado del retiro' },
      { status: 500 }
    )
  }
}
