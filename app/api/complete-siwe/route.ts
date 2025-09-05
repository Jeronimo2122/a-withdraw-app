import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export const POST = async (req: NextRequest) => {
  const { payload, nonce } = (await req.json()) as IRequestPayload
  
  if (nonce !== cookies().get('siwe')?.value) {
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: 'Invalid nonce',
    })
  }
  
  try {
    const validMessage = await verifySiweMessage(payload, nonce)
    
    if (validMessage.isValid) {
      // Store user session data with extended information
      // Note: User data comes from MiniKit, not from the SIWE payload
      const sessionData = {
        address: payload.address,
        username: null, // Will be populated by client
        profilePictureUrl: null, // Will be populated by client
        permissions: null, // Will be populated by client
        optedIntoOptionalAnalytics: null, // Will be populated by client
        worldAppVersion: null, // Will be populated by client
        deviceOS: null, // Will be populated by client
        loginTime: new Date().toISOString()
      }
      
      // Store session data in cookie (in production, consider using a database)
      cookies().set("user_address", payload.address, { 
        secure: true, 
        httpOnly: true, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      // Store additional user data (you might want to use a database instead)
      cookies().set("user_data", JSON.stringify(sessionData), { 
        secure: true, 
        httpOnly: true, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      // Clear the nonce after successful verification
      cookies().delete("siwe")
    }
    
    return NextResponse.json({
      status: 'success',
      isValid: validMessage.isValid,
      address: payload.address,
    })
  } catch (error: any) {
    // Handle errors in validation or processing
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message,
    })
  }
}
