import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, Star, Users, Phone, MessageCircle, BadgeCheck, Sparkles } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import HeroChatPreview from '@/components/HeroChatPreview'

const HOW_IT_WORKS = [
  {
    icon: <MessageCircle size={28} />,
    step: '01',
    title: 'Chat with our AI',
    desc: 'Tell it what you want to book, when, and where. Plain English — no forms.',
    color: 'from-rose-600 to-pink-500',
  },
  {
    icon: <Phone size={28} />,
    step: '02',
    title: 'We call the business',
    desc: 'Our system dials them directly, checks live availability, and locks your slot.',
    color: 'from-pink-600 to-rose-400',
  },
  {
    icon: <BadgeCheck size={28} />,
    step: '03',
    title: 'Confirmation SMS',
    desc: 'You get a text within 2 minutes. No hold music, no back-and-forth.',
    color: 'from-rose-500 to-pink-300',
  },
]

const PRO_FEATURES = [
  'Priority listing at top of search results',
  'AI booking widget for your own website',
  'Analytics dashboard & booking insights',
  'Automated SMS reminders to clients',
  'Zero commission on every booking',
  'Dedicated account manager',
]

const LIVE_TICKER = [
  'Velvet Touch Salon — Mayfair',
  'The Green Fork Restaurant — Soho',
  "The Barber's Den — Canary Wharf",
  'Bloom Beauty Bar — Shoreditch',
  'London Bridge Hotel — SE1',
  'Flex Gym — Clapham',
]

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="overflow-hidden salon-bg">

      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-10 pb-14 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left fade-up">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold mb-6 uppercase tracking-wider">
              <Sparkles size={11} />
              AI-Powered · Free to Use · 60-Second Confirmation
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-white">Book Any Local</span>
              <br />
              <span className="salon-gradient-text">Business Instantly</span>
            </h1>

            <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Restaurant, salon, hotel, gym, clinic — just tell our AI what you need.
              We call the business to check live availability and confirm your slot in under 60 seconds.
            </p>

            {/* Live ticker */}
            <div className="flex items-center gap-3 mb-8">
              <span className="flex-shrink-0 text-xs font-semibold text-rose-400 uppercase tracking-wider whitespace-nowrap">
                Booking now:
              </span>
              <div className="overflow-hidden flex-1 max-w-xs lg:max-w-sm">
                <div className="ticker-track flex gap-8 whitespace-nowrap">
                  {[...LIVE_TICKER, ...LIVE_TICKER].map((s, i) => (
                    <span key={i} className="text-xs text-white/50 flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block animate-pulse" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link href="/chat" className={`${btn.primary} text-base px-8 py-4 salon-btn-primary`}>
                Book Something Now <ArrowRight size={18} />
              </Link>
              <Link href="/providers" className={`${btn.secondary} text-base px-8 py-4`}>
                List Your Business
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 justify-center lg:justify-start text-sm text-white/45">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-rose-400" />AI-powered calls</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-rose-400" />2-min booking</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-rose-400" />Free to use</span>
            </div>
          </div>

          {/* Right: AI chat preview */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <HeroChatPreview />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="border-y border-rose-500/10 py-5 salon-glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5 text-center py-2">
          {[
            { n: 'AI',      l: 'Powered matching' },
            { n: '< 2min',  l: 'Avg booking time' },
            { n: 'SMS',     l: 'Instant confirmation' },
            { n: '£0',      l: 'Free to use' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-extrabold salon-gradient-text">{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL LOG WIDGET ───────────────────────────────────── */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-rose-500/15 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-bold text-white">Recent Calls</span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block animate-pulse" />
                Live
              </span>
            </div>
            {[
              { status: 'AI handled', detail: 'Haircut enquiry — Mon 2pm', badge: 'bg-sky-500/15 text-sky-400' },
              { status: 'Booked',     detail: 'Table for 2 — Sat 7:30pm',  badge: 'bg-green-500/15 text-green-400' },
              { status: 'Missed',     detail: 'Dental check-up query',      badge: 'bg-red-500/15 text-red-400' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04] last:border-0">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.badge} mr-2`}>{row.status}</span>
                  <span className="text-white/50 text-xs">{row.detail}</span>
                </div>
                <span className="text-white/20 text-xs">just now</span>
              </div>
            ))}
            <div className="px-5 py-3 bg-rose-500/5 border-t border-rose-500/10 text-center">
              <span className="text-xs text-white/35">Connect your number to see real data</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SET UP IN 3 STEPS ─────────────────────────────────── */}
      <section className="py-6 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-white/70">Set up in 3 steps →</span>
          {[
            { n: '1', label: 'Add your number' },
            { n: '2', label: 'Set your hours' },
            { n: '3', label: 'Go live' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-sm text-white/70">
              <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{s.n}</span>
              {s.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES GRID (from vertical.config) ────────────── */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <h2 className="text-2xl font-bold text-white mb-2">
            Book <span className="salon-gradient-text">Any Business</span>, Any Time
          </h2>
          <p className="text-white/45 max-w-md mx-auto text-sm">Pick a category or just describe what you need in plain English</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.categories.map(cat => (
            <Link
              key={cat.id}
              href={`/chat?service=${cat.id}`}
              className="salon-service-card group"
            >
              <div className="text-2xl">{cat.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-rose-200 transition-colors text-sm">
                  {cat.label}
                </div>
                <div className="text-rose-300/60 text-xs mt-0.5">{cat.desc}</div>
              </div>
              <ArrowRight size={14} className="text-white/20 group-hover:text-rose-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-10 px-6 salon-glass border-y border-rose-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white mb-2">
              From Chat to <span className="salon-gradient-text">Confirmed</span> in 3 Steps
            </h2>
            <p className="text-white/45 text-sm">No back-and-forth. No hold music. Just booked.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-7 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-rose-500/20 via-rose-400/40 to-rose-500/20" />
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="relative text-center flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-3 salon-step-icon shadow-lg shadow-rose-500/20`}>
                  {step.icon}
                </div>
                <div className="absolute top-0 right-[calc(50%-28px-20px)] text-xs font-bold text-rose-400/50 font-mono">{step.step}</div>
                <h3 className="font-bold text-white text-sm mb-1">{step.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-7">
            <Link href="/chat" className={`${btn.primary} text-sm px-6 py-3`}>
              Try it now — free <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURE PILLS ─────────────────────────────────────── */}
      <section className="py-8 px-6 salon-glass border-y border-rose-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Booking the way it <span className="salon-gradient-text">should be</span>
          </h2>
          <p className="text-white/45 mb-6 max-w-lg mx-auto text-sm">No hold music. No forms. No back-and-forth. Our AI handles the call so you don&apos;t have to.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '🎙 Describe in plain English',
              '📞 We call the business',
              '📱 SMS confirmation',
              '🚫 No hold music',
              '£0 Free to use',
              '⚡ Under 2 minutes',
              '🏪 Restaurants, salons, hotels & more',
              '✅ Live availability check',
            ].map(pill => (
              <span key={pill} className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-white/70 text-sm font-medium">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS OWNER CTA ────────────────────────────────── */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-5 items-center">
          {/* Free listing */}
          <div className="salon-card p-6 relative overflow-hidden">
            <div className="salon-card-shimmer" />
            <div className="text-2xl mb-3">🏪</div>
            <h3 className="text-xl font-bold text-white mb-2">List Your {config.providerLabel} <span className="salon-gradient-text">Free</span></h3>
            <p className="text-white/50 text-sm mb-5 leading-relaxed">
              Get discovered by customers looking to book right now. No setup fee, no monthly contract for the base listing.
            </p>
            <ul className="space-y-2 mb-5">
              {['Free listing in our directory', 'Bookings via AI chat', 'Customer reviews', 'Profile page included'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/65">
                  <CheckCircle size={15} className="text-rose-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/providers" className={`${btn.secondary} w-full justify-center py-3`}>
              List My {config.providerLabel} — Free
            </Link>
          </div>

          {/* Pro plan */}
          <div className="salon-pro-card relative overflow-hidden p-6">
            <div className="salon-card-shimmer" />
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">⭐</div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30 uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {config.name} <span className="salon-gradient-text">Pro</span>
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-white">$29</span>
              <span className="text-white/40 text-sm">/month</span>
            </div>
            <ul className="space-y-2 mb-5">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                  <Zap size={14} className="text-rose-300 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/providers?plan=pro" className={`${btn.primary} w-full justify-center py-3 text-sm salon-btn-primary`}>
              Go Pro → <ArrowRight size={16} />
            </Link>
            <p className="text-center text-white/30 text-xs mt-3">14-day free trial · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── WHY BOOKINGCALL ───────────────────────────────────── */}
      <section className="py-8 px-6 salon-glass border-t border-rose-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white mb-2">
              Why <span className="salon-gradient-text">{config.name}</span>?
            </h2>
            <p className="text-white/45 text-sm">Built for how people actually book today</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Shield size={18} />, title: 'Verified Businesses', desc: 'Every listing is verified and reviewed before accepting bookings.' },
              { icon: <Star size={18} />,   title: 'Real Reviews',        desc: 'Genuine reviews from real customers — nothing fabricated.' },
              { icon: <Zap size={18} />,    title: 'AI Matching',         desc: 'Describe what you want in plain English. No tick boxes.' },
              { icon: <Users size={18} />,  title: 'Any Category',        desc: 'Restaurants, salons, hotels, gyms, clinics and more.' },
              { icon: <CheckCircle size={18} />, title: 'Transparent Pricing', desc: 'Starting prices shown upfront. The business confirms exact cost.' },
              { icon: <Phone size={18} />,  title: 'We Call, Not You',    desc: 'Our system dials the business. You just wait for the SMS.' },
            ].map(f => (
              <div key={f.title} className="salon-feature-card flex gap-3 items-start p-4 rounded-2xl border border-rose-500/10 bg-rose-500/5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-300 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-0.5">{f.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-10 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to book? <span className="salon-gradient-text">Takes 60 seconds.</span>
          </h2>
          <p className="text-white/45 mb-6 text-sm">Free to use. No account needed. Just chat.</p>
          <Link href="/chat" className={`${btn.primary} text-base px-10 py-4 salon-btn-primary`}>
            Book Something Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}
