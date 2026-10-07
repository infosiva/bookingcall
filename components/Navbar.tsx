import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Navbar() {
  const link: React.CSSProperties = { minHeight: 44, display: 'inline-flex', alignItems: 'center', padding: '0 10px', fontSize: 14, color: '#a9b6c6', textDecoration: 'none' }
  return (
    <nav aria-label="Main" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(12,26,43,0.88)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(250,204,21,0.22)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 12px 0 20px', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" aria-label="BookingCall home" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f4f1e8', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
          <Logo size={28} /><span>Booking<span style={{ color: '#facc15' }}>Call</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/register" style={link}>For venues</Link>
          <Link href="/chat" style={{ ...link, background: '#facc15', color: '#0c1a2b', fontWeight: 700, borderRadius: 999, padding: '0 16px', marginLeft: 6 }}>Book</Link>
        </div>
      </div>
    </nav>
  )
}
