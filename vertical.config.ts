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
  tagline:    'Book any local business — AI chats, we call to confirm your slot',
  domain:     'bookingcall.app',
  themeColor: 'rose',

  providerLabel:  'Business',
  providerPlural: 'Businesses',
  consumerLabel:  'Customer',

  categories: [
    { id: 'restaurant', label: 'Restaurant',        icon: '🍽️', desc: 'Table booking for any cuisine' },
    { id: 'haircut',    label: 'Haircut & Styling',  icon: '✂️', desc: 'Cuts, blowouts, colour, treatments' },
    { id: 'hotel',      label: 'Hotel / B&B',        icon: '🏨', desc: 'Room booking, check-in enquiries' },
    { id: 'massage',    label: 'Massage & Spa',      icon: '💆', desc: 'Swedish, deep tissue, hot stone' },
    { id: 'dental',     label: 'Dental',             icon: '🦷', desc: 'Check-up, cleaning, whitening' },
    { id: 'physio',     label: 'Physiotherapy',      icon: '🏥', desc: 'Injury rehab, sports therapy' },
    { id: 'gym',        label: 'Gym & Fitness',      icon: '💪', desc: 'Trial sessions, memberships, classes' },
    { id: 'tattoo',     label: 'Tattoo & Piercing',  icon: '🖊️', desc: 'Custom ink, fine-line, piercings' },
  ],

  pricingModel:       'session',
  bookingFlow:        'instant',
  minPrice:           20,
  maxPrice:           300,
  sessionMinutes:     60,
  platformFeePercent: 0,

  aiSystemPrompt: `You are a friendly booking assistant for BookingCall.
Your job is to help customers book ANY local business — restaurant, salon, hotel, gym, clinic, or any other service — via AI chat. We find the business using their location and call them to confirm.

COLLECTION FLOW (ask one at a time, naturally):
1. What do they want to book? (restaurant table, haircut, hotel room, massage, dental, gym class, etc.)
2. Preferred date and time? For restaurants ask party size too. Offer flexibility if "anytime soon".
3. Their full name?
4. Their phone number? (we'll send confirmation)
5. Their location or postcode? (to find the right business nearby)

Once you have ALL details, confirm clearly, then say:
"Perfect! We'll call them now to lock in your booking. You'll hear back within 2 minutes!"

THEN output this exact JSON block on a new line (required to trigger the call):
BOOKING_READY:{"service":"<service>","date":"<date>","time":"<time>","name":"<name>","phone":"<phone>","location":"<location>"}

Examples of what you can book:
- "Table for 2 at an Italian restaurant tonight" → service: "italian restaurant table for 2"
- "Haircut tomorrow at 11am" → service: "haircut"
- "Hotel room for Friday night" → service: "hotel room"
- "Dental check-up next week" → service: "dental"
- "60 minute massage Saturday afternoon" → service: "massage"

Rules:
- Conversational and brief — no bullet lists of questions at once
- Never give medical advice
- On price queries: "The business will confirm pricing when we call"
- If they hesitate on phone number: "We only use it to confirm your booking"
- If business type is unclear, ask one clarifying question`,

  aiMatchHints: [
    'near me', 'same day', 'tonight', 'this weekend', 'walk-in', 'table for two', 'group booking',
  ],

  features: {
    backgroundCheck:  false,
    portfolioPhotos:  true,
    videoIntro:       false,
    instantBook:      true,
    recurringBook:    true,
    homeVisit:        false,
    remoteSession:    false,
    groupSession:     true,
    insuranceBadge:   false,
    aiDiagnosis:      false,
    careJournal:      false,
    callBooking:      true,
  },

  metaTitle:       'BookingCall — AI Books Any Local Business With a Real Phone Call',
  metaDescription: 'Book restaurants, salons, hotels, gyms, clinics — just chat with our AI and we call to confirm your slot. No hold music, no forms.',
  keywords:        ['restaurant booking', 'salon booking', 'hotel booking', 'book table online', 'clinic appointment', 'AI booking assistant'],
}

export default config
