'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Phone, CheckCircle, Sparkles, MapPin } from 'lucide-react'
import { theme } from '@/lib/theme'

interface Msg { role: 'user' | 'assistant'; content: string }

interface BookingDetails {
  service:  string
  date:     string
  time:     string
  name:     string
  phone:    string
  location: string
}

interface SalonInfo {
  name:    string
  phone:   string
  address: string
}

type CallState = 'idle' | 'searching' | 'calling' | 'confirmed' | 'no_salon'

// Quick-reply chips shown at the start and contextually
const SERVICE_CHIPS  = ['Haircut', 'Facial', 'Massage', 'Nails', 'Beard trim', 'Highlights']
const TODAY_SLOTS    = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']
const TOMORROW_SLOTS = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']

export default function BookingChatWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your BookingCall assistant. What service are you looking to book today? (e.g. haircut, facial, massage, dental...)`,
    },
  ])
  const [input, setInput]         = useState('')
  const [loading, setLoad]        = useState(false)
  const [callState, setCallState] = useState<CallState>('idle')
  const [booking, setBooking]     = useState<BookingDetails | null>(null)
  const [salon, setSalon]         = useState<SalonInfo | null>(null)
  const [showSlots, setShowSlots] = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading, callState])

  // Auto-advance calling → confirmed after 5s (Twilio call is in flight)
  useEffect(() => {
    if (callState !== 'calling') return
    const t = setTimeout(() => setCallState('confirmed'), 5000)
    return () => clearTimeout(t)
  }, [callState])

  function quickSend(text: string) {
    setInput(text)
    setTimeout(() => {
      setInput('')
      doSend(text)
    }, 0)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading || callState !== 'idle') return
    setInput('')
    await doSend(text)
  }

  async function doSend(text: string) {

    const newMsgs: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setLoad(true)

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: newMsgs.slice(-12) }),
      })
      const data = await res.json() as {
        reply:            string
        bookingTriggered?: boolean
        booking?:         BookingDetails
        salon?:           SalonInfo
        callStatus?:      string
      }

      setMsgs(prev => [...prev, { role: 'assistant', content: data.reply }])

      // Show slot picker if AI is asking about date/time
      const replyLower = data.reply.toLowerCase()
      if (replyLower.includes('what time') || replyLower.includes('when would') || replyLower.includes('preferred time') || replyLower.includes('which day')) {
        setShowSlots(true)
      } else {
        setShowSlots(false)
      }

      if (data.bookingTriggered && data.booking) {
        setBooking(data.booking)
        // Show "searching" briefly, then move to calling/no_salon
        setCallState('searching')
        setTimeout(() => {
          if (data.salon) {
            setSalon(data.salon)
            setCallState(data.callStatus === 'initiated' ? 'calling' : 'confirmed')
          } else {
            setCallState('no_salon')
          }
        }, 1500)
      }
    } catch {
      setMsgs(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
        <Sparkles size={18} className="text-white" />
        <span className="font-semibold text-white text-sm">BookingCall AI</span>
        <span className="ml-auto flex items-center gap-1.5 text-white/70 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? `bg-gradient-to-r ${theme.gradient} text-white`
                  : 'glass text-white/85'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing / AI thinking */}
        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Searching nearby salons */}
        {callState === 'searching' && booking && (
          <div className="glass border border-rose-500/20 rounded-2xl p-4 mt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MapPin size={16} className="text-rose-400 animate-pulse" />
              <span className="text-white/80 text-sm">Finding best {booking.service} salon near {booking.location}...</span>
            </div>
            <div className="flex justify-center gap-1">
              {[0,1,2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-rose-400/50 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Calling */}
        {callState === 'calling' && booking && salon && (
          <div className="glass border border-rose-500/30 rounded-2xl p-4 mt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Phone size={18} className="text-rose-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">Calling {salon.name}...</span>
            </div>
            <p className="text-white/50 text-xs">{salon.address}</p>
            <p className="text-white/55 text-xs mt-1">
              Booking <strong className="text-white/80">{booking.service}</strong> for{' '}
              <strong className="text-white/80">{booking.name}</strong> · {booking.date} at {booking.time}
            </p>
            <div className="flex justify-center gap-1 mt-1">
              {[0,1,2,3,4].map(i => (
                <span key={i} className="w-1.5 h-6 rounded-full bg-rose-400/60 animate-pulse"
                  style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Confirmed */}
        {callState === 'confirmed' && booking && (
          <div className="glass border border-green-500/30 rounded-2xl p-4 mt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              <span className="text-white font-semibold text-sm">
                {salon ? `Called ${salon.name}!` : 'Booking request sent!'}
              </span>
            </div>
            <p className="text-white/55 text-xs">
              {salon
                ? `${salon.name} has been called. They'll confirm your slot.`
                : 'Your booking request has been sent.'}
              {' '}Confirmation text → <strong className="text-white/80">{booking.phone}</strong>
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-left">
              {([
                ['Service', booking.service],
                ['Date',    booking.date],
                ['Time',    booking.time],
                salon ? ['Salon', salon.name] : ['Near', booking.location],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="glass rounded-lg px-3 py-1.5">
                  <div className="text-white/40 text-[10px] uppercase tracking-wider">{k}</div>
                  <div className="text-white/85 text-xs font-medium capitalize">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No salon found */}
        {callState === 'no_salon' && booking && (
          <div className="glass border border-amber-500/30 rounded-2xl p-4 mt-2 text-center space-y-2">
            <p className="text-amber-400 font-semibold text-sm">No {booking.service} salon found near {booking.location}</p>
            <p className="text-white/50 text-xs">Try a different location or a broader service term.</p>
            <button
              onClick={() => setCallState('idle')}
              className={`mt-2 px-4 py-1.5 rounded-lg bg-gradient-to-r ${theme.gradient} text-white text-xs`}
            >
              Try again
            </button>
          </div>
        )}

        {/* Quick service chips — only at start */}
        {msgs.length === 1 && callState === 'idle' && !loading && (
          <div className="px-1 pb-1">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Quick select</p>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_CHIPS.map(s => (
                <button
                  key={s}
                  onClick={() => quickSend(s)}
                  className="text-xs px-3 py-1.5 rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time slot picker */}
        {showSlots && callState === 'idle' && !loading && (
          <div className="px-1 pb-2">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Available slots</p>
            <div className="mb-1.5">
              <p className="text-white/40 text-[10px] mb-1">Today</p>
              <div className="flex flex-wrap gap-1.5">
                {TODAY_SLOTS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setShowSlots(false); quickSend(`Today at ${t}`) }}
                    className={`text-xs px-3 py-1.5 rounded-lg glass border border-rose-500/20 text-rose-300 hover:bg-rose-500/10 transition-all`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] mb-1">Tomorrow</p>
              <div className="flex flex-wrap gap-1.5">
                {TOMORROW_SLOTS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setShowSlots(false); quickSend(`Tomorrow at ${t}`) }}
                    className={`text-xs px-3 py-1.5 rounded-lg glass border border-rose-500/20 text-rose-300 hover:bg-rose-500/10 transition-all`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        {callState === 'idle' || callState === 'no_salon' ? (
          <div className="flex gap-2">
            <input
              className="input-dark flex-1 text-sm py-2.5"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white disabled:opacity-40 transition-all`}
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        ) : (
          <p className="text-center text-white/30 text-xs py-2">
            {callState === 'searching' && 'Searching nearby salons...'}
            {callState === 'calling'   && 'Calling salon — please wait...'}
            {callState === 'confirmed' && 'Done! Check your phone for confirmation.'}
          </p>
        )}
        <p className="text-white/20 text-xs mt-2 text-center">
          Powered by BookingCall AI · Free to use
        </p>
      </div>
    </div>
  )
}
