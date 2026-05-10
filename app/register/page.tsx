'use client'
import { useState } from 'react'
import { CheckCircle, Phone, Zap, Star } from 'lucide-react'
import { theme, btn } from '@/lib/theme'

const SERVICES = [
  { id: 'plumber',     label: '🔧 Plumber' },
  { id: 'electrician', label: '⚡ Electrician' },
  { id: 'ac-repair',   label: '❄️ AC & HVAC' },
  { id: 'carpenter',   label: '🪚 Carpenter' },
  { id: 'painter',     label: '🖌️ Painter & Decorator' },
  { id: 'cctv',        label: '📷 CCTV & Security' },
  { id: 'cleaner',     label: '🧹 Deep Cleaning' },
  { id: 'handyman',    label: '🛠️ Handyman' },
  { id: 'gardener',    label: '🌿 Gardener' },
  { id: 'locksmith',   label: '🔑 Locksmith' },
]

const BENEFITS = [
  { icon: <Phone size={18}/>,       text: '30 days free listing — no card needed' },
  { icon: <Zap size={18}/>,         text: 'Customers matched to you directly — 0% booking fee' },
  { icon: <Star size={18}/>,        text: 'AI qualifies every lead before they call you' },
  { icon: <CheckCircle size={18}/>, text: 'Only £15/month after free trial — cancel anytime' },
]

type Step = 'form' | 'success'

export default function RegisterPage() {
  const [step, setStep]         = useState<Step>('form')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [salonName, setSalonName] = useState('')

  const [form, setForm] = useState({
    name:     '',
    phone:    '',
    postcode: '',
    city:     '',
    email:    '',
    services: [] as string[],
  })

  function toggleService(id: string) {
    setForm(f => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter(s => s !== id)
        : [...f.services, id],
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.postcode || !form.email) {
      setError('Please fill in all required fields.')
      return
    }
    if (!form.services.length) {
      setError('Select at least one service.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.')
        return
      }
      setSalonName(form.name)
      setStep('success')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className={`max-w-md w-full glass rounded-3xl p-10 text-center border ${theme.border}`}>
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center mx-auto mb-6`}>
            <CheckCircle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">You&apos;re listed, {salonName}!</h1>
          <p className="text-white/55 mb-6">
            Your business is now live on LocalBoost. When a customer nearby needs your trade,
            they&apos;ll be matched to you directly — no middleman, no booking fees.
          </p>
          <div className={`glass rounded-2xl p-4 border ${theme.border} text-left mb-6`}>
            <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-2`}>Free Trial</p>
            <p className="text-white font-semibold text-lg">30 days free listing</p>
            <p className="text-white/45 text-sm">No card. Then just £15/month. Cancel any time.</p>
          </div>
          <a href="/" className={btn.primary + ' w-full justify-center'}>
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-16 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-4`}>
          <Zap size={12} /> Free Trial — No Card Required
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          List your trade on LocalBoost — free
        </h1>
        <p className="text-white/50 max-w-xl mx-auto">
          Customers find you, get a fixed quote, and call directly. Zero booking fees — ever. Just £15/month after trial.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Benefits */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg mb-6">What you get free:</h2>
          {BENEFITS.map((b, i) => (
            <div key={i} className={`${theme.card} p-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                {b.icon}
              </div>
              <p className="text-white/80 text-sm">{b.text}</p>
            </div>
          ))}
          <div className={`glass rounded-2xl p-5 border ${theme.border} mt-6`}>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">After trial</p>
            <p className="text-white font-bold text-2xl">£15<span className="text-white/40 text-base font-normal">/month</span></p>
            <p className="text-white/50 text-sm mt-1">Unlimited leads · Priority listing · Dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className={`${theme.card} rounded-2xl p-6 space-y-4`}>
          <h2 className="text-white font-bold text-lg">Register your trade</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-white/50 text-xs mb-1 block">Business name *</label>
              <input className="input-dark w-full text-sm" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Phone number *</label>
              <input className="input-dark w-full text-sm" placeholder="07911 123456" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Postcode *</label>
              <input className="input-dark w-full text-sm" placeholder="SW1A 1AA" value={form.postcode}
                onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">City / Town *</label>
              <input className="input-dark w-full text-sm" placeholder="London" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Email *</label>
              <input className="input-dark w-full text-sm" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs mb-2 block">Trade(s) offered *</label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    form.services.includes(s.id)
                      ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent`
                      : 'border-white/10 text-white/50 hover:border-white/25'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={btn.primary + ' w-full justify-center py-3 text-sm mt-2'}
          >
            {loading ? 'Registering...' : 'Start free listing — 30 days free'}
          </button>
          <p className="text-white/25 text-xs text-center">No card. Cancel any time.</p>
        </form>
      </div>
    </div>
  )
}
