/**
 * POST /api/register
 * Salon self-registration. Saves to data/salons.json (file-based MVP).
 * In prod: swap for Supabase insert.
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export interface Salon {
  id:        string   // slug from name + postcode
  name:      string
  phone:     string   // international format e.g. +447911123456
  postcode:  string
  city:      string
  services:  string[] // ['haircut','nails','facial',...]
  email:     string
  trialUsed: number   // call count used in free trial
  trialMax:  number   // 20 calls free
  createdAt: string
}

const DATA_PATH = join(process.cwd(), 'data', 'salons.json')

function loadSalons(): Salon[] {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf8')) }
  catch { return [] }
}

function saveSalons(salons: Salon[]) {
  writeFileSync(DATA_PATH, JSON.stringify(salons, null, 2))
}

function makeId(name: string, postcode: string): string {
  return (name + '-' + postcode).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string; phone: string; postcode: string
      city: string; services: string[]; email: string
    }

    const { name, phone, postcode, city, services, email } = body
    if (!name || !phone || !postcode || !email) {
      return NextResponse.json({ error: 'name, phone, postcode, email required' }, { status: 400 })
    }

    if (name.length > 100 || postcode.length > 10 || (city && city.length > 100)) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!/^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (!Array.isArray(services) || services.length === 0 || services.length > 20) {
      return NextResponse.json({ error: 'Provide 1–20 services' }, { status: 400 })
    }
    if (services.some((s: unknown) => typeof s !== 'string' || s.length > 50)) {
      return NextResponse.json({ error: 'Invalid service name' }, { status: 400 })
    }

    const salons = loadSalons()
    const existing = salons.find(s => s.email === email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered', salon: existing }, { status: 409 })
    }

    const salon: Salon = {
      id:        makeId(name, postcode),
      name,
      phone:     phone.startsWith('+') ? phone : `+44${phone.replace(/^0/, '')}`,
      postcode:  postcode.toUpperCase(),
      city,
      services:  services ?? [],
      email,
      trialUsed: 0,
      trialMax:  20,
      createdAt: new Date().toISOString(),
    }

    salons.push(salon)
    saveSalons(salons)

    console.log(`[register] New salon: ${salon.name} (${salon.phone}) — ${salon.id}`)
    return NextResponse.json({ success: true, salon })

  } catch (err) {
    console.error('/api/register error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  // Used by /api/call to look up salons
  const salons = loadSalons()
  return NextResponse.json(salons)
}
