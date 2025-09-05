import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // En producción, esto vendría de una API externa o base de datos
    const exchangeRates = [
      {
        from: 'EUR',
        to: 'USD',
        rate: 2860,
        lastUpdated: new Date().toISOString()
      }
    ]

    return NextResponse.json(exchangeRates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    )
  }
}
