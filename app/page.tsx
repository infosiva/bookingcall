'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import config from '@/vertical.config'

// Illustrative only: venue, times and wording are made up and labelled as such on the page.
const SCRIPT = [
  { who: 'You', t: 'Table for two, Friday around 8pm, somewhere quiet.' },
  { who: 'AI', t: 'Got it. I will ask the venue about 8:00pm, party of two, quiet area.' },
  { who: 'AI', t: 'Calling the venue now. If nobody picks up, I will give you a WhatsApp message to send instead.' },
]
const FULL = SCRIPT.map(l => l.t).join('')

const ROUTE = [
  { n: '01', t: 'Say what you need', d: 'Type it in plain words: what, when, how many.' },
  { n: '02', t: 'We place the call', d: 'An automated call is attempted to the venue. Calls can fail or go unanswered.' },
  { n: '03', t: 'Or you get a message', d: 'If the call is not possible, you get a ready-to-send WhatsApp message.' },
]

type Cat = { id: string; label: string; desc: string }

export default function HomePage() {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? FULL.length : 0)
  useEffect(() => {
    if (reduced) { setN(FULL.length); return }
    const id = setInterval(() => setN(c => (c >= FULL.length ? c : c + 2)), 30)
    return () => clearInterval(id)
  }, [reduced])

  const cats = ((config as unknown as { categories?: Cat[] }).categories ?? []).slice(0, 8)
  let left = n

  return (
    <div className="bc-page">
      <div className="bc-bg" aria-hidden />
      <div className="bc-wrap">
        <div className="bc-mast"><span>The Booking Dispatch</span><span>Chat, call, confirmed</span></div>

        <header className="bc-hero">
          <div>
            <p className="bc-kicker">Travel desk in your pocket</p>
            <h1 className="bc-h1 bc-serif">Book the table, <em>not the phone queue</em></h1>
            <p className="bc-sub">Tell BookingCall what you want. It tries to ring the venue for you, and if it cannot, it hands you a message to send.</p>
            <Link href="/chat" className="bc-cta">Start a booking</Link>
            <p className="bc-note">Free to try, no account needed. Calls are attempted, not guaranteed.</p>
          </div>

          <aside className="bc-ticket" aria-label="Example booking conversation">
            <div className="bc-tk-head"><span className="bc-tag">Example, made-up details</span><span>No. 0001</span></div>
            {SCRIPT.map((l, i) => {
              const take = Math.max(0, Math.min(l.t.length, left)); left -= take
              if (!take && !reduced) return null
              return (
                <p key={i} className="bc-line"><span className="bc-who">{l.who}</span><span>{l.t.slice(0, take)}{take < l.t.length && <span className="bc-caret" aria-hidden />}</span></p>
              )
            })}
          </aside>
        </header>

        {cats.length > 0 && (
          <section className="bc-sec">
            <h2 className="bc-serif">Destinations</h2>
            <p className="bc-lead">Pick what you are booking. The chat opens ready for it.</p>
            <div className="bc-grid">
              {cats.map((c, i) => (
                <Link key={c.id} href={`/chat?service=${encodeURIComponent(c.id)}`} className="bc-dest">
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t">{c.label}</span>
                  <span className="d">{c.desc}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bc-sec">
          <h2 className="bc-serif">The route</h2>
          <p className="bc-lead">Three stops, no hold music.</p>
          <div className="bc-route">
            {ROUTE.map(s => (<div key={s.n} className="bc-stop"><b>{s.n}</b><h3>{s.t}</h3><p>{s.d}</p></div>))}
          </div>
        </section>

        <section className="bc-sec">
          <div className="bc-box">
            <h2 className="bc-serif">Run a venue?</h2>
            <p>Venue listings are planned. Paid plans do not exist yet and nothing can be purchased today.</p>
            <p style={{ marginTop: 14 }}><Link href="/register" className="bc-cta2">Register your interest</Link></p>
          </div>
        </section>
      </div>
      <div className="bc-foot"><div className="bc-wrap">BookingCall uses AI and automated calls. Venues may not answer; confirm important bookings yourself.</div></div>
    </div>
  )
}
