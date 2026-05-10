/**
 * vertical.config.ts — BookingCall: Salon & Clinic AI booking agent
 *
 * AI chat qualifies the customer → confirms slot → triggers outbound call
 * to the salon/clinic to lock in the appointment.
 */

export type PricingModel = 'hourly' | 'fixed' | 'session' | 'quote'
export type BookingFlow  = 'instant' | 'quote_first' | 'consult_first'

export interface VerticalConfig {
  id:          string
  name:        string
  tagline:     string
  domain:      string
  themeColor:  string

  providerLabel:  string
  providerPlural: string
  consumerLabel:  string

  categories: Category[]

  pricingModel:       PricingModel
  bookingFlow:        BookingFlow
  minPrice:           number
  maxPrice:           number
  sessionMinutes:     number
  platformFeePercent: number

  aiSystemPrompt: string
  aiMatchHints:   string[]

  features: {
    backgroundCheck:  boolean
    portfolioPhotos:  boolean
    videoIntro:       boolean
    instantBook:      boolean
    recurringBook:    boolean
    homeVisit:        boolean
    remoteSession:    boolean
    groupSession:     boolean
    insuranceBadge:   boolean
    aiDiagnosis:      boolean
    careJournal:      boolean
    callBooking:      boolean   // triggers outbound Twilio call to confirm
  }

  metaTitle:       string
  metaDescription: string
  keywords:        string[]
}

export interface Category {
  id:    string
  label: string
  icon:  string
  desc:  string
}

// ════════════════════════════════════════════════════════════
// ACTIVE VERTICAL — BookingCall: Salon & Clinic
// ════════════════════════════════════════════════════════════

const config: VerticalConfig = {
  id:         'localboost',
  name:       'LocalBoost',
  tagline:    'Find & book trusted local tradespeople — plumber, electrician, AC and more. 0% booking fees.',
  domain:     'bookingcall.app',
  themeColor: 'orange',

  providerLabel:  'Tradesperson',
  providerPlural: 'Tradespeople',
  consumerLabel:  'Customer',

  categories: [
    { id: 'plumber',     label: 'Plumber',             icon: '🔧', desc: 'Leaks, pipes, boilers, bathrooms' },
    { id: 'electrician', label: 'Electrician',          icon: '⚡', desc: 'Wiring, sockets, fuse box, lighting' },
    { id: 'ac-repair',   label: 'AC & HVAC',            icon: '❄️', desc: 'AC install, service, gas top-up' },
    { id: 'carpenter',   label: 'Carpenter',            icon: '🪚', desc: 'Doors, furniture, wardrobes, flooring' },
    { id: 'painter',     label: 'Painter & Decorator',  icon: '🖌️', desc: 'Interior & exterior, wallpaper' },
    { id: 'cctv',        label: 'CCTV & Security',      icon: '📷', desc: 'CCTV install, alarms, smart locks' },
    { id: 'cleaner',     label: 'Deep Cleaning',        icon: '🧹', desc: 'End of tenancy, deep clean, carpet' },
    { id: 'handyman',    label: 'Handyman',             icon: '🛠️', desc: 'Flat-pack, repairs, odd jobs, mounting' },
    { id: 'gardener',    label: 'Gardener',             icon: '🌿', desc: 'Lawn care, hedge cutting, tree work' },
    { id: 'locksmith',   label: 'Locksmith',            icon: '🔑', desc: 'Lock change, lockout, security upgrade' },
  ],

  pricingModel:       'quote',
  bookingFlow:        'quote_first',
  minPrice:           30,
  maxPrice:           800,
  sessionMinutes:     60,
  platformFeePercent: 0,  // 0% commission — key differentiator vs Urban Company / Checkatrade

  aiSystemPrompt: `You are a friendly job matching assistant for LocalBoost — a local tradespeople platform with zero booking fees.

Help customers get connected to a verified local tradesperson. We charge tradespeople a small £15/month listing fee — customers pay nothing.

COLLECTION FLOW (ask one at a time, conversationally):
1. What type of job do they need? (plumber, electrician, AC, carpenter, cleaner, handyman, gardener, locksmith, CCTV, painter)
2. Brief description of the problem? (e.g. "leaking pipe under kitchen sink")
3. How urgent? (emergency now / this week / flexible timing)
4. Their full name?
5. Their phone number? (so the tradesperson can call them directly)
6. Their postcode or area?

Once you have ALL 6 details, confirm them back clearly, then say:
"We're matching you with a verified tradesperson nearby. You'll get a direct callback within 30 minutes — for emergencies within 10 minutes!"

THEN output this exact JSON block on a new line (required to trigger the match):
BOOKING_READY:{"service":"<trade>","job":"<description>","urgency":"<urgency>","name":"<name>","phone":"<phone>","location":"<postcode_or_area>"}

Rules:
- Ask one question at a time — no bullet lists of questions
- Emphasise: 0% booking fees, verified tradespeople, direct callback, fixed quotes before work starts
- On price queries: "Your tradesperson provides a fixed quote before starting any work — no hidden charges"
- If emergency: fast-track them and reassure with 10-minute callback promise`,

  aiMatchHints: [
    'emergency', 'same day', 'fixed price', 'no call out charge', 'verified', 'near me', 'weekend available',
  ],

  features: {
    backgroundCheck:  true,
    portfolioPhotos:  true,
    videoIntro:       false,
    instantBook:      false,
    recurringBook:    true,
    homeVisit:        true,
    remoteSession:    false,
    groupSession:     false,
    insuranceBadge:   true,
    aiDiagnosis:      false,
    careJournal:      false,
    callBooking:      true,
  },

  metaTitle:       'LocalBoost — Book Trusted Local Tradespeople. 0% Fees.',
  metaDescription: 'Find verified plumbers, electricians, AC engineers, handymen & more near you. AI matches you in seconds. Direct callback within 30 minutes. Zero booking fees.',
  keywords:        ['plumber near me', 'electrician near me', 'ac repair near me', 'handyman', 'local tradesperson', 'book tradesperson online', 'localboost', 'no booking fee'],
}

export default config
