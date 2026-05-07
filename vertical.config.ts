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
  id:         'bookingcall',
  name:       'BookingCall',
  tagline:    'Book any salon or clinic — AI chats, we call to confirm',
  domain:     'bookingcall.app',
  themeColor: 'rose',

  providerLabel:  'Salon',
  providerPlural: 'Salons',
  consumerLabel:  'Customer',

  categories: [
    { id: 'haircut',  label: 'Haircut & Styling', icon: '✂️',  desc: 'Cuts, blowouts, colour, treatments' },
    { id: 'nails',    label: 'Nails',             icon: '💅',  desc: 'Manicure, pedicure, gel, acrylic' },
    { id: 'facial',   label: 'Facial & Skin',     icon: '🧖',  desc: 'Facials, peels, microdermabrasion' },
    { id: 'massage',  label: 'Massage',           icon: '💆',  desc: 'Swedish, deep tissue, hot stone' },
    { id: 'dental',   label: 'Dental',            icon: '🦷',  desc: 'Check-up, cleaning, whitening' },
    { id: 'physio',   label: 'Physiotherapy',     icon: '🏥',  desc: 'Injury rehab, sports therapy' },
    { id: 'laser',    label: 'Laser & IPL',       icon: '✨',  desc: 'Hair removal, skin rejuvenation' },
    { id: 'tattoo',   label: 'Tattoo & Piercing', icon: '🖊️',  desc: 'Custom ink, fine-line, piercings' },
  ],

  pricingModel:       'session',
  bookingFlow:        'instant',
  minPrice:           20,
  maxPrice:           300,
  sessionMinutes:     60,
  platformFeePercent: 0,

  aiSystemPrompt: `You are a friendly booking assistant for BookingCall.
Your job is to help customers book a salon or clinic appointment via AI chat.

COLLECTION FLOW (ask one at a time, naturally):
1. What service do they want? (haircut, facial, massage, dental, physio, etc.)
2. Preferred date and time? Offer flexibility if they say "anytime soon".
3. Their full name?
4. Their phone number? (we'll text confirmation)
5. Their location or postcode? (to find nearby salons)

Once you have ALL 5 details, confirm everything back clearly, then say:
"We'll call the salon now to lock in your slot. Confirmation text within 2 minutes!"

THEN output this exact JSON block on a new line (required to trigger the call):
BOOKING_READY:{"service":"<service>","date":"<date>","time":"<time>","name":"<name>","phone":"<phone>","location":"<location>"}

Rules:
- Conversational and brief — no bullet lists of questions at once
- Never give medical advice
- On price queries: "The salon will confirm pricing when we call — most services start from £20"
- If they hesitate on phone number: "We only use it to text your confirmation"`,

  aiMatchHints: [
    'near me', 'same day', 'weekend availability', 'walk-in', 'experienced', 'female therapist',
  ],

  features: {
    backgroundCheck:  false,
    portfolioPhotos:  true,
    videoIntro:       false,
    instantBook:      true,
    recurringBook:    true,
    homeVisit:        false,
    remoteSession:    false,
    groupSession:     false,
    insuranceBadge:   false,
    aiDiagnosis:      false,
    careJournal:      false,
    callBooking:      true,
  },

  metaTitle:       'BookingCall — AI Books Your Salon Appointment With a Real Call',
  metaDescription: 'Chat with our AI, we call the salon to confirm your booking. Haircuts, facials, dental, massage — booked in 2 minutes.',
  keywords:        ['salon booking', 'book haircut online', 'clinic appointment', 'book massage', 'dental appointment'],
}

export default config
