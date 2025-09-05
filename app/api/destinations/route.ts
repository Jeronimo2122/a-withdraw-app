import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // En producción, esto vendría de una base de datos
    const destinations = [
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

    return NextResponse.json(destinations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}
