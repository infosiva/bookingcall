import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BookingCall — AI Books Any Local Business With a Real Phone Call'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e0a3c 0%, #0f172a 50%, #150a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>📞</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#ffffff', letterSpacing: '-1px', textAlign: 'center' }}>
          BookingCall
        </div>
        <div style={{ fontSize: 26, color: '#c4b5fd', marginTop: 16, textAlign: 'center', maxWidth: 700 }}>
          AI Books Any Local Business With a Real Phone Call
        </div>
        <div style={{ fontSize: 18, color: '#ddd6fe', marginTop: 24, opacity: 0.8 }}>
          bookingcall.app
        </div>
      </div>
    ),
    { ...size }
  )
}
