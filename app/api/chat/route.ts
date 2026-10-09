import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import config from '@/vertical.config'
import { AI_LIMITER } from '@/lib/rateLimit'

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

// ponytail: aiChat() returns whole text, so re-emit it as OpenAI-format SSE deltas (provider-level streaming needs a lib/ai.ts change)
function sseText(text: string) {
  const enc = new TextEncoder()
  const parts = text.match(/\S+\s*|\s+/g) || []
  return new Response(new ReadableStream({
    async start(c) {
      for (const p of parts) { c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: p } }] })}\n\n`)); await new Promise(r => setTimeout(r, 15)) }
      c.enqueue(enc.encode('data: [DONE]\n\n')); c.close()
    },
  }), { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req); if (limited) return limited

  const wantStream = (req.headers.get('accept') || '').includes('text/event-stream')
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
          whatsappUrl?: string
        }

        // WhatsApp fallback — append link to AI reply
        let finalReply = cleanReply
        if (callData.status === 'whatsapp_fallback' && callData.whatsappUrl && callData.salon) {
          finalReply += `\n\n📲 [Tap to message ${callData.salon.name} on WhatsApp](${callData.whatsappUrl}) — your booking details are pre-filled.`
        }

        if (wantStream) return sseText(finalReply)
        return NextResponse.json({
          reply:            finalReply,
          bookingTriggered: true,
          booking,
          salon:            callData.salon,
          callStatus:       callData.status,
          whatsappUrl:      callData.whatsappUrl,
        })
      } catch (e) {
        console.error('[call trigger]', e)
      }
    }

    if (wantStream) return sseText(cleanReply)
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
