import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import config from '@/vertical.config'

export const dynamic = 'force-dynamic'

export interface BookingDetails {
  service:  string
  date:     string
  time:     string
  name:     string
  phone:    string
  location: string
}

function extractBooking(text: string): BookingDetails | null {
  const match = text.match(/BOOKING_READY:(\{[^}]+\})/)
  if (!match) return null
  try {
    return JSON.parse(match[1]) as BookingDetails
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const reply = await aiChat(messages, config.aiSystemPrompt, 512, 'balanced')

    // Detect booking completion signal from AI
    const booking = extractBooking(reply)
    const cleanReply = reply.replace(/BOOKING_READY:\{[^}]+\}/, '').trim()

    if (booking && (config.features as any).callBooking) {
      // Await call so we can return salon name to UI
      const baseUrl = req.nextUrl.origin
      try {
        const callRes  = await fetch(`${baseUrl}/api/call`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(booking),
        })
        const callData = await callRes.json() as {
          status: string
          salon?: { name: string; phone: string; address: string }
          callSid?: string
        }
        return NextResponse.json({
          reply:            cleanReply,
          bookingTriggered: true,
          booking,
          salon:            callData.salon,
          callStatus:       callData.status,
        })
      } catch (e) {
        console.error('[call trigger]', e)
      }
    }

    return NextResponse.json({
      reply:            cleanReply,
      bookingTriggered: !!booking,
      booking:          booking ?? undefined,
    })
  } catch (err) {
    console.error('/api/chat error:', err)
    return NextResponse.json(
      { reply: 'Sorry, I had trouble responding. Please try again in a moment.' },
      { status: 200 },
    )
  }
}
