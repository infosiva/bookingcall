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
