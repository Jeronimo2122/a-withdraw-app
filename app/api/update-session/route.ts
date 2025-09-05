import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface UpdateSessionRequest {
  address: string
  username?: string
  profilePictureUrl?: string
  permissions?: {
    notifications: boolean
    contacts: boolean
  }
  optedIntoOptionalAnalytics?: boolean
  worldAppVersion?: number
  deviceOS?: string
}

export const POST = async (req: NextRequest) => {
  try {
    const sessionData: UpdateSessionRequest = await req.json()
    
    if (!sessionData.address) {
      return NextResponse.json({
        status: 'error',
        message: 'Address is required'
      })
    }

    // Update the user_data cookie with the new information
    const updatedSessionData = {
      address: sessionData.address,
      username: sessionData.username || null,
      profilePictureUrl: sessionData.profilePictureUrl || null,
      permissions: sessionData.permissions || null,
      optedIntoOptionalAnalytics: sessionData.optedIntoOptionalAnalytics || null,
      worldAppVersion: sessionData.worldAppVersion || null,
      deviceOS: sessionData.deviceOS || null,
      loginTime: new Date().toISOString()
    }
    
    cookies().set("user_data", JSON.stringify(updatedSessionData), { 
      secure: true, 
      httpOnly: true, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return NextResponse.json({
      status: 'success',
      message: 'Session updated successfully'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Failed to update session'
    })
  }
}
