import { NextRequest, NextResponse } from 'next/server'
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js'

interface IRequestPayload {
	payload: ISuccessResult
	action: string
	signal: string | undefined
}

export async function POST(req: NextRequest) {
	try {
		console.log('Received verification request')
		const { payload, action, signal } = (await req.json()) as IRequestPayload
		
		if (!payload || !action) {
			console.error('Missing required fields:', { payload, action })
			return NextResponse.json({ 
				error: 'Missing required fields',
				status: 400 
			}, { status: 400 })
		}

		const app_id = process.env.APP_ID as `app_${string}`
		if (!app_id) {
			console.error('APP_ID is not configured')
			return NextResponse.json({ 
				error: 'Server configuration error',
				status: 500 
			}, { status: 500 })
		}

		console.log('Verifying proof with:', { action, signal })
		const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse
		console.log('Verification result:', verifyRes)

		if (verifyRes.success) {
			return NextResponse.json({ 
				verifyRes, 
				status: 200 
			}, { status: 200 })
		} else {
			console.error('Verification failed:', verifyRes)
			return NextResponse.json({ 
				verifyRes, 
				status: 400,
				error: 'Verification failed. Please try again.'
			}, { status: 400 })
		}
	} catch (error) {
		console.error('Error in verification endpoint:', error)
		return NextResponse.json({ 
			error: 'Internal server error',
			status: 500 
		}, { status: 500 })
	}
}
