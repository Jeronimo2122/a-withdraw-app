import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    // Clear all authentication cookies
    cookies().delete("user_address")
    cookies().delete("user_data")
    cookies().delete("siwe")
    
    // Set cookies to expire in the past to ensure they're cleared
    cookies().set("user_address", "", { 
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "strict"
    })
    cookies().set("user_data", "", { 
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "strict"
    })
    cookies().set("siwe", "", { 
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "strict"
    })
    
    return NextResponse.json({
      status: 'success',
      message: 'Logged out successfully',
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    })
  }
}
