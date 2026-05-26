import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, Users, CheckCircle, Sparkles, Phone, MessageCircle, BadgeCheck } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import HeroChatPreview from '@/components/HeroChatPreview'

// ── Data ─────────────────────────────────────────────────────
const SERVICES = [
  { icon: '✂️', label: 'Haircut & Style',       price: 'from £25', id: 'haircut' },
  { icon: '🎨', label: 'Colour & Highlights',    price: 'from £65', id: 'colour' },
  { icon: '🧖', label: 'Facials & Skin',         price: 'from £45', id: 'facial' },
  { icon: '💅', label: 'Manicure & Pedicure',    price: 'from £30', id: 'nails' },
  { icon: '🪒', label: 'Beard & Grooming',       price: 'from £20', id: 'grooming' },
  { icon: '💆', label: 'Massage & Spa',          price: 'from £55', id: 'massage' },
]

const HOW_IT_WORKS = [
  {
    icon: <MessageCircle size={28} />,
    step: '01',
    title: 'Chat with our AI',
    desc: 'Tell it what service you want, when, and where. Plain conversation — no forms.',
    color: 'from-rose-600 to-pink-500',
  },
  {
    icon: <Phone size={28} />,
    step: '02',
    title: 'We call the salon',
    desc: 'Our system dials the salon directly, checks real availability, and locks your slot.',
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

const FEATURED_SALONS = [
  {
    name: 'Velvet Touch Salon',
    location: 'Mayfair, London',
    specialty: 'Hair Colour & Balayage',
    badge: '⚡ Fast confirmer',
    emoji: '💇',
  },
  {
    name: 'Bloom Beauty Bar',
    location: 'Shoreditch, London',
    specialty: 'Facials & Skin Therapy',
    badge: '🌟 Verified salon',
    emoji: '🌸',
  },
  {
    name: "The Barber's Den",
    location: 'Canary Wharf',
    specialty: "Men's Grooming",
    badge: '🏆 Premium',
    emoji: '🪒',
  },
]

const LIVE_TICKER = [
  'Velvet Touch Salon — Mayfair',
  'Bloom Beauty Bar — Shoreditch',
  "The Barber's Den — Canary Wharf",
  'Glow Studio — Notting Hill',
  'Luxe Nail Lounge — Chelsea',
]

const PRO_FEATURES = [
  'Priority listing at top of search results',
  'AI booking widget for your own website',
  'Analytics dashboard & booking insights',
  'Automated SMS reminders to clients',
  'Zero commission on every booking',
  'Dedicated account manager',
]

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="overflow-hidden salon-bg">

      {/* ── Decorative floating beauty icons ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <span className="beauty-float beauty-float-1 absolute text-3xl opacity-10 top-[15%] left-[8%]">✂️</span>
        <span className="beauty-float beauty-float-2 absolute text-3xl opacity-10 top-[25%] right-[10%]">💄</span>
        <span className="beauty-float beauty-float-3 absolute text-3xl opacity-10 top-[60%] left-[5%]">💅</span>
        <span className="beauty-float beauty-float-4 absolute text-3xl opacity-10 top-[70%] right-[7%]">🌸</span>
        <span className="beauty-float beauty-float-5 absolute text-3xl opacity-10 top-[40%] left-[90%]">🪒</span>
        {/* Rose-gold aurora orbs */}
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-12 pb-32 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left fade-up">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold mb-6 uppercase tracking-wider">
              <Sparkles size={11} />
              AI-Powered · Free to Use · 60-Second Confirmation
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-white">Book Your Perfect</span>
              <br />
              <span className="salon-gradient-text">Salon Visit</span>
            </h1>

            <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tell our AI what you need. We call the salon to check live availability and
              confirm your slot — all done in under 60 seconds. No hold music. No forms.
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
                Find My Salon <ArrowRight size={18} />
              </Link>
              <Link href="/providers" className={`${btn.secondary} text-base px-8 py-4`}>
                List Your Salon
              </Link>
            </div>

            {/* Trust row */}
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
      <section className="border-y border-rose-500/10 py-10 salon-glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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

      {/* ── SERVICES GRID ─────────────────────────────────────── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Every Beauty Service, <span className="salon-gradient-text">One Place</span>
          </h2>
          <p className="text-white/45 max-w-md mx-auto">Browse by category or describe exactly what you want to our AI</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICES.map(cat => (
            <Link
              key={cat.id}
              href={`/chat?service=${cat.id}`}
              className="salon-service-card group"
            >
              <div className="salon-service-icon">{cat.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-rose-200 transition-colors text-sm md:text-base">
                  {cat.label}
                </div>
                <div className="text-rose-300/70 text-xs mt-0.5 font-medium">{cat.price}</div>
              </div>
              <ArrowRight size={16} className="text-white/20 group-hover:text-rose-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-12 px-6 salon-glass border-y border-rose-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              From Chat to <span className="salon-gradient-text">Confirmed</span> in 3 Steps
            </h2>
            <p className="text-white/45">No back-and-forth. No hold music. Just booked.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-9 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-rose-500/20 via-rose-400/40 to-rose-500/20" />
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="relative text-center flex flex-col items-center">
                <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5 salon-step-icon shadow-lg shadow-rose-500/20`}>
                  {step.icon}
                </div>
                <div className="absolute top-0 right-[calc(50%-36px-20px)] text-xs font-bold text-rose-400/50 font-mono">{step.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Mini CTA */}
          <div className="text-center mt-12">
            <Link href="/chat" className={`${btn.primary} text-sm px-6 py-3`}>
              Try it now — free <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED SALONS ───────────────────────────────────── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Featured <span className="salon-gradient-text">Salons</span>
          </h2>
          <p className="text-white/45">Hand-picked, top-rated salons available for instant booking</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_SALONS.map(salon => (
            <div key={salon.name} className="salon-card group">
              {/* Card shimmer overlay */}
              <div className="salon-card-shimmer" />
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{salon.emoji}</div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20">
                  {salon.badge}
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mb-1 group-hover:text-rose-200 transition-colors">
                {salon.name}
              </h3>
              <p className="text-white/40 text-xs mb-3">{salon.location}</p>
              <p className="text-rose-300/80 text-xs font-medium mb-5">{salon.specialty}</p>
              <Link
                href={`/chat?salon=${encodeURIComponent(salon.name)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-300 border border-rose-500/25 hover:bg-rose-500/10 hover:border-rose-400/40 transition-all duration-200"
              >
                Book now <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY IT WORKS ──────────────────────────────────────── */}
      <section className="py-12 px-6 salon-glass border-y border-rose-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Booking the way it <span className="salon-gradient-text">should be</span>
          </h2>
          <p className="text-white/45 mb-10 max-w-lg mx-auto">No hold music. No forms. No back-and-forth. Our AI handles the call so you don&apos;t have to.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '🎙 Describe in plain English',
              '📞 We call the salon',
              '📱 SMS confirmation',
              '🚫 No hold music',
              '£0 Free to use',
              '⚡ Under 2 minutes',
              '🔄 Rebook same stylist',
              '✅ Live availability check',
            ].map(pill => (
              <span key={pill} className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-white/70 text-sm font-medium">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SALON OWNER / PRO CTA ─────────────────────────────── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: free listing */}
          <div className="salon-card p-8 relative overflow-hidden">
            <div className="salon-card-shimmer" />
            <div className="text-3xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">List Your Salon <span className="salon-gradient-text">Free</span></h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Get discovered by thousands of customers looking to book right now. No setup fee, no monthly contract for the base listing.
            </p>
            <ul className="space-y-2.5 mb-7">
              {['Free listing in our directory', 'Bookings via AI chat', 'Customer reviews', 'Profile page included'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/65">
                  <CheckCircle size={15} className="text-rose-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link href="/providers" className={`${btn.secondary} w-full justify-center py-3`}>
              List My Salon — Free
            </Link>
          </div>

          {/* Right: Pro plan */}
          <div className="salon-pro-card relative overflow-hidden p-8">
            <div className="salon-card-shimmer" />
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⭐</div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30 uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Salon <span className="salon-gradient-text">Pro</span>
            </h3>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-extrabold text-white">$29</span>
              <span className="text-white/40 text-sm">/month</span>
            </div>
            <ul className="space-y-2.5 mb-7">
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
      <section className="py-10 px-6 salon-glass border-t border-rose-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why <span className="salon-gradient-text">{config.name}</span>?
            </h2>
            <p className="text-white/45">Built for how people actually book today</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Shield size={20} />, title: 'Verified Salons',        desc: 'Every salon is verified and reviewed before accepting bookings.' },
              { icon: <Star size={20} />,   title: 'Real Reviews',           desc: 'Genuine reviews from real customers — nothing fabricated.' },
              { icon: <Zap size={20} />,    title: 'AI Matching',            desc: 'Describe what you want in plain English. No tick boxes.' },
              { icon: <Users size={20} />,  title: 'Regular Bookings',       desc: 'Rebook the same stylist or therapist effortlessly every time.' },
              { icon: <CheckCircle size={20} />, title: 'Transparent Pricing', desc: 'Starting prices shown upfront. The salon confirms exact cost.' },
              { icon: <Phone size={20} />,  title: 'We Call, Not You',       desc: 'Our system dials the salon. You just wait for the SMS.' },
            ].map(f => (
              <div key={f.title} className="salon-feature-card flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1 text-sm">{f.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center salon-final-cta rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-pink-900/20 to-rose-900/40 rounded-3xl" />
          <div className="relative">
            <div className="text-5xl mb-5">💄</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready for your perfect salon visit?
            </h2>
            <p className="text-white/50 mb-8 text-lg">
              Free to use. No card required. Booked in 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/chat" className={`${btn.primary} text-base px-10 py-4 salon-btn-primary`}>
                Find My Salon <ArrowRight size={18} />
              </Link>
              <Link href="/providers" className={`${btn.secondary} text-base px-8 py-4`}>
                I own a salon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/30 text-sm">© 2026 BookingCall · AI-Powered Salon Booking</div>
          <div className="flex gap-6 text-sm text-white/35">
            <Link href="/how-it-works" className="hover:text-rose-300 transition-colors">How it works</Link>
            <Link href="/providers" className="hover:text-rose-300 transition-colors">For salons</Link>
            <Link href="/search" className="hover:text-rose-300 transition-colors">Browse salons</Link>
            <Link href="/chat" className="hover:text-rose-300 transition-colors">Book now</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
