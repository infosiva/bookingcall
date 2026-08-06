import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req); if (limited) return limited

  const { service } = await req.json()
  if (!service) return NextResponse.json({ error: 'Missing service' }, { status: 400 })

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional phone booking assistant. Write a short, friendly 3-sentence booking confirmation script for a business. Be specific, warm, and professional. Include: greeting, confirmation of what was booked, and next steps.',
        },
        { role: 'user', content: `Write a booking script for: ${service}` },
      ],
      max_tokens: 150,
    }),
  })

  const data = await res.json()
  const script = data.choices?.[0]?.message?.content || 'Unable to generate script.'
  return NextResponse.json({ script })
}
