'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import config from '@/vertical.config'
import { btn, theme } from '@/lib/theme'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.2 4.3c.6-.6 1.5-.7 2.1-.1l1.8 1.7c.5.5.6 1.3.2 1.9l-.9 1.4c-.3.5-.2 1.1.2 1.5l3.5 3.5c.4.4 1 .5 1.5.2l1.4-.9c.6-.4 1.4-.3 1.9.2l1.7 1.8c.6.6.5 1.5-.1 2.1l-1.1 1c-.7.7-1.8.9-2.7.5-2.7-1.2-5.3-3.1-7.5-5.3-2.2-2.2-4.1-4.8-5.3-7.5-.4-.9-.2-2 .5-2.7l1-1.1Z"
                stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"
              />
              <path d="M16 4l1.5 1.5L21 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
          <span className={`${theme.gradientText} font-extrabold tracking-tight`}>
            {config.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/search"       className="hover:text-white transition-colors">Find a {config.providerLabel}</Link>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/register"     className="hover:text-white transition-colors font-medium text-rose-400/80">For {config.providerPlural} — Free Trial</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/register" className={btn.ghost}>List my {config.providerLabel.toLowerCase()}</Link>
          <Link href="/chat"     className={btn.primary}>Book now</Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/search"       className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>Find a {config.providerLabel}</Link>
          <Link href="/how-it-works" className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/register"     className="text-rose-400/80 font-medium"   onClick={() => setOpen(false)}>For {config.providerPlural} — Free Trial</Link>
          <Link href="/chat"         className={btn.primary}                    onClick={() => setOpen(false)}>Book now</Link>
        </div>
      )}
    </nav>
  )
}
