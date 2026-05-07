/**
 * POST /api/call
 * Priority:
 *   1. Registered salon in local registry (data/salons.json) — postcode + service match
 *   2. Google Places API fallback — find top result near user's location
 * Then: Twilio outbound call
 *
 * Env vars required:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM_NUMBER       — your Twilio number e.g. +14155552671
 *   GOOGLE_PLACES_API_KEY    — console.cloud.google.com → Places API
 *   NEXT_PUBLIC_BASE_URL     — your deployment URL (for TwiML webhook)
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { BookingDetails } from '../chat/route'
import type { Salon } from '../register/route'

// ── Registry lookup ───────────────────────────────────────────────────────────

function loadRegistry(): Salon[] {
  try { return JSON.parse(readFileSync(join(process.cwd(), 'data', 'salons.json'), 'utf8')) }
  catch { return [] }
}

function findInRegistry(
  service: string,
  location: string,
): { name: string; phone: string; address: string } | null {
  const salons   = loadRegistry()
  if (!salons.length) return null

  const svc      = service.toLowerCase()
  const loc      = location.toLowerCase().replace(/\s/g, '')

  // Match: service overlaps + postcode/city in location string
  const match = salons.find(s => {
    if (s.trialUsed >= s.trialMax) return false   // trial exhausted
    const serviceMatch = s.services.some(sv => svc.includes(sv) || sv.includes(svc))
    const locMatch     = loc.includes(s.postcode.toLowerCase().replace(/\s/g, '')) ||
                         loc.includes(s.city.toLowerCase())
    return serviceMatch && locMatch
  })

  if (!match) return null
  return { name: match.name, phone: match.phone, address: `${match.city} ${match.postcode}` }
}

function incrementTrialUsed(phone: string) {
  try {
    const path   = join(process.cwd(), 'data', 'salons.json')
    const salons: Salon[] = JSON.parse(readFileSync(path, 'utf8'))
    const idx    = salons.findIndex(s => s.phone === phone)
    if (idx >= 0) {
      salons[idx].trialUsed++
      const { writeFileSync } = require('fs')
      writeFileSync(path, JSON.stringify(salons, null, 2))
    }
  } catch { /* non-critical */ }
}

// ── Google Places ─────────────────────────────────────────────────────────────

interface PlaceResult {
  name:              string
  formatted_address: string
  formatted_phone_number?: string
  international_phone_number?: string
  place_id: string
  rating?:  number
}

// Maps service keyword → Google Places search query suffix
const SERVICE_QUERY_MAP: Record<string, string> = {
  haircut:       'hair salon',
  hair:          'hair salon',
  styling:       'hair salon',
  blowout:       'hair salon',
  colour:        'hair salon',
  color:         'hair salon',
  nails:         'nail salon',
  manicure:      'nail salon',
  pedicure:      'nail salon',
  gel:           'nail salon',
  acrylic:       'nail salon',
  facial:        'beauty salon facial',
  skin:          'skin clinic',
  massage:       'massage therapy',
  spa:           'spa massage',
  dental:        'dental clinic',
  dentist:       'dentist',
  whitening:     'dental clinic',
  physio:        'physiotherapy clinic',
  physiotherapy: 'physiotherapy clinic',
  laser:         'laser clinic',
  ipl:           'laser clinic',
  tattoo:        'tattoo studio',
  piercing:      'piercing studio',
}

function buildSearchQuery(service: string, location: string): string {
  const svc   = service.toLowerCase()
  const match = Object.keys(SERVICE_QUERY_MAP).find(k => svc.includes(k))
  const place = match ? SERVICE_QUERY_MAP[match] : `${service} salon`
  return `${place} near ${location}`
}

async function findSalon(
  service: string,
  location: string,
): Promise<{ name: string; phone: string; address: string } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('[places] GOOGLE_PLACES_API_KEY not set')
    return null
  }

  const query = buildSearchQuery(service, location)
  console.log(`[places] Searching: "${query}"`)

  // Step 1: Text search → get place_ids
  const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  searchUrl.searchParams.set('query', query)
  searchUrl.searchParams.set('key', apiKey)

  const searchRes  = await fetch(searchUrl.toString())
  const searchData = await searchRes.json() as { results: Array<{ place_id: string; name: string }> }

  if (!searchData.results?.length) {
    console.warn('[places] No results for:', query)
    return null
  }

  // Step 2: Details for top result → get phone number
  const topPlaceId = searchData.results[0].place_id
  const detailUrl  = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  detailUrl.searchParams.set('place_id', topPlaceId)
  detailUrl.searchParams.set('fields', 'name,formatted_phone_number,international_phone_number,formatted_address,rating')
  detailUrl.searchParams.set('key', apiKey)

  const detailRes  = await fetch(detailUrl.toString())
  const detailData = await detailRes.json() as { result: PlaceResult }
  const place      = detailData.result

  const phone = place.international_phone_number ?? place.formatted_phone_number
  if (!phone) {
    console.warn(`[places] No phone for "${place.name}" — trying next result`)

    // Try second result
    if (searchData.results.length > 1) {
      const secondId    = searchData.results[1].place_id
      const d2Url       = new URL('https://maps.googleapis.com/maps/api/place/details/json')
      d2Url.searchParams.set('place_id', secondId)
      d2Url.searchParams.set('fields', 'name,formatted_phone_number,international_phone_number,formatted_address')
      d2Url.searchParams.set('key', apiKey)
      const d2Res  = await fetch(d2Url.toString())
      const d2Data = await d2Res.json() as { result: PlaceResult }
      const p2     = d2Data.result.international_phone_number ?? d2Data.result.formatted_phone_number
      if (p2) {
        return { name: d2Data.result.name, phone: p2, address: d2Data.result.formatted_address }
      }
    }
    return null
  }

  return { name: place.name, phone, address: place.formatted_address }
}

// ── Twilio ────────────────────────────────────────────────────────────────────

function twilioAuth(): string {
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) throw new Error('Twilio credentials not configured')
  return Buffer.from(`${sid}:${token}`).toString('base64')
}

async function initiateCall(params: {
  toNumber:  string
  salonName: string
  booking:   BookingDetails
  baseUrl:   string
}): Promise<{ callSid: string }> {
  const { toNumber, salonName, booking, baseUrl } = params
  const sid        = process.env.TWILIO_ACCOUNT_SID!
  const fromNumber = process.env.TWILIO_FROM_NUMBER!

  const twimlUrl = new URL('/api/call-status/twiml', baseUrl)
  twimlUrl.searchParams.set('name',      booking.name)
  twimlUrl.searchParams.set('service',   booking.service)
  twimlUrl.searchParams.set('date',      booking.date)
  twimlUrl.searchParams.set('time',      booking.time)
  twimlUrl.searchParams.set('location',  booking.location)
  twimlUrl.searchParams.set('salonName', salonName)

  const statusUrl = new URL('/api/call-status/webhook', baseUrl)

  const body = new URLSearchParams({
    To:                   toNumber,
    From:                 fromNumber,
    Url:                  twimlUrl.toString(),
    StatusCallback:       statusUrl.toString(),
    StatusCallbackMethod: 'POST',
  })

  const res  = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Basic ${twilioAuth()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    },
  )
  const data = await res.json() as { sid?: string; message?: string }
  if (!res.ok) throw new Error(`Twilio: ${data.message ?? JSON.stringify(data)}`)
  return { callSid: data.sid! }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const booking: BookingDetails = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin

    // 1. Check registered salons first (free trial partners)
    let salon = findInRegistry(booking.service, booking.location)
    let source = 'registry'

    // 2. Fall back to Google Places
    if (!salon) {
      source = 'google_places'
      salon  = await findSalon(booking.service, booking.location)
    }

    if (!salon) {
      console.warn('[call] No salon found anywhere')
      return NextResponse.json({
        status:  'no_salon_found',
        message: `Could not find a ${booking.service} salon near ${booking.location}`,
        booking,
      })
    }

    console.log(`[call] Found via ${source}: "${salon.name}" — ${salon.phone}`)

    // 3. Check Twilio configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_FROM_NUMBER) {
      console.warn('[call] Twilio not configured — logging only')
      return NextResponse.json({
        status: 'skipped',
        reason: 'twilio_not_configured',
        source,
        salon,
        booking,
      })
    }

    // 4. Initiate call
    const { callSid } = await initiateCall({
      toNumber:  salon.phone,
      salonName: salon.name,
      booking,
      baseUrl,
    })

    // 5. Track trial usage for registered salons
    if (source === 'registry') incrementTrialUsed(salon.phone)

    console.log(`[call] Initiated ${callSid} → "${salon.name}" for ${booking.name}`)
    return NextResponse.json({ status: 'initiated', callSid, source, salon, booking })

  } catch (err) {
    console.error('/api/call error:', err)
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
