'use client'
import { useState } from 'react'

const EXAMPLES = [
  'dental cleaning',
  'haircut & blow-dry',
  'deep tissue massage',
  'table for 2 at 7:30pm',
  'car service & MOT',
]

export default function BookingDemo() {
  const [service, setService] = useState('')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!service.trim()) return
    setLoading(true)
    setScript('')
    try {
      const res = await fetch('/api/booking-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      })
      const data = await res.json()
      setScript(data.script || 'Error generating script.')
    } catch {
      setScript('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <p className="text-white/50 text-xs mb-3 text-center">
        Try it — generate your AI booking script:
      </p>

      {/* Example pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => setService(ex)}
            className="px-3 py-1 rounded-full text-xs border border-rose-500/25 bg-rose-500/8 text-white/55 hover:text-white/80 hover:border-rose-400/40 transition-colors cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2 mb-4">
        <input
          value={service}
          onChange={e => setService(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. dental cleaning, haircut, massage..."
          className="flex-1 px-4 py-3 rounded-xl border border-rose-500/20 bg-white/[0.04] text-white placeholder-white/30 text-sm focus:outline-none focus:border-rose-400/50 focus:bg-white/[0.06] transition-all"
        />
        <button
          onClick={generate}
          disabled={loading || !service.trim()}
          className="px-5 py-3 rounded-xl font-semibold text-sm text-white whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            boxShadow: '0 0 18px rgba(244,63,94,0.35)',
          }}
        >
          {loading ? '…' : 'Generate'}
        </button>
      </div>

      {/* Result */}
      {script && (
        <>
          <div
            className="rounded-2xl p-5 mb-4 text-sm leading-relaxed text-white/85 italic border border-rose-500/15"
            style={{ background: 'rgba(244,63,94,0.06)' }}
          >
            &ldquo;{script}&rdquo;
          </div>
          <div className="text-center">
            <a
              href="/providers"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}
            >
              Set up real bookings for your business →
            </a>
          </div>
        </>
      )}
    </div>
  )
}
