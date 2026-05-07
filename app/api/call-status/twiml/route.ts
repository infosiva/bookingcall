/**
 * GET /api/call-status/twiml
 * Twilio fetches this when the salon picks up the call.
 * Returns TwiML that reads out the booking details.
 */
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const name      = searchParams.get('name')      ?? 'a customer'
  const service   = searchParams.get('service')   ?? 'an appointment'
  const date      = searchParams.get('date')      ?? 'soon'
  const time      = searchParams.get('time')      ?? 'to be confirmed'
  const salonName = searchParams.get('salonName') ?? 'your salon'

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say voice="Polly.Amy-Neural">
    Hello, ${salonName}! This is an automated booking call from BookingCall dot app.
    A customer named ${name} would like to book a ${service} appointment.
    Their preferred date is ${date}, at ${time}.
    Please call or text them back to confirm. Their details are in your BookingCall dashboard.
    Thank you and have a great day!
  </Say>
  <Pause length="1"/>
</Response>`

  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}

// Twilio may also POST to this URL in some configs
export { GET as POST }
