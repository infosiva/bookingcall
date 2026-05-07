/**
 * POST /api/call-status/webhook
 * Twilio status callback — logs call outcome.
 * In production: update DB, send customer SMS, notify salon dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData  = await req.formData()
    const callSid   = formData.get('CallSid')   as string
    const callStatus = formData.get('CallStatus') as string
    const to        = formData.get('To')        as string
    const duration  = formData.get('CallDuration') as string

    console.log(`[call-status] sid=${callSid} status=${callStatus} to=${to} duration=${duration}s`)

    // TODO production: save to DB, push notification to salon dashboard, SMS customer
    // await updateBookingCallStatus(callSid, callStatus)
    // if (callStatus === 'completed') await sendCustomerSMS(phone, confirmationMsg)
    // if (callStatus === 'no-answer') await scheduleRetry(callSid)

    return NextResponse.json({ received: true, callSid, callStatus })
  } catch (err) {
    console.error('/api/call-status/webhook error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
