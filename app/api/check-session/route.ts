import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userAddress = cookies().get('user_address')?.value
    const userDataCookie = cookies().get('user_data')?.value
    
    if (!userAddress) {
      return NextResponse.json({
        isValid: false,
        message: 'No session found'
      })
    }

    // Parse stored user data if available
    let userData = null
    if (userDataCookie) {
      try {
        userData = JSON.parse(userDataCookie)
      } catch (parseError) {
        console.error('Error parsing user data:', parseError)
      }
    }

    // In a real application, you might want to verify the session
    // against a database or validate the token/signature
    // For now, we'll just check if the cookie exists
    
    return NextResponse.json({
      isValid: true,
      address: userAddress,
      username: userData?.username || null,
      profilePictureUrl: userData?.profilePictureUrl || null,
      permissions: userData?.permissions || null,
      optedIntoOptionalAnalytics: userData?.optedIntoOptionalAnalytics || null,
      worldAppVersion: userData?.worldAppVersion || null,
      deviceOS: userData?.deviceOS || null,
      loginTime: userData?.loginTime || null,
      message: 'Valid session found'
    })
  } catch (error: any) {
    return NextResponse.json({
      isValid: false,
      message: error.message || 'Session check failed'
    })
  }
}
