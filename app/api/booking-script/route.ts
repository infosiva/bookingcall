import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'

// Last-resort fallback when every Groq model fails (bad key / outage / rate limit)
async function geminiFallback(system: string, userText: string, maxTokens = 400): Promise<string | null> {
  const gk = process.env.GEMINI_API_KEY
  if (!gk) return null
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${gk}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: userText }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: 0.6 } }),
    })
    if (!r.ok) return null
    return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text ?? null
  } catch { return null }
}

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
      model: 'qwen/qwen3.8-27b',
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

  const data = await res.json().catch(() => ({}))
  let script: string | null = data.choices?.[0]?.message?.content ?? null
  if (!script) script = await geminiFallback('You are a professional phone booking assistant. Write a short, friendly 3-sentence booking confirmation script.', `Write a booking script for: ${service}`, 150)
  if (!script) return NextResponse.json({ error: 'Script generation is temporarily unavailable' }, { status: 503 })
  return NextResponse.json({ script })
}
