import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* simplified phone handset */}
          <path
            d="M5.2 4.3c.6-.6 1.5-.7 2.1-.1l1.8 1.7c.5.5.6 1.3.2 1.9l-.9 1.4c-.3.5-.2 1.1.2 1.5l3.5 3.5c.4.4 1 .5 1.5.2l1.4-.9c.6-.4 1.4-.3 1.9.2l1.7 1.8c.6.6.5 1.5-.1 2.1l-1.1 1c-.7.7-1.8.9-2.7.5-2.7-1.2-5.3-3.1-7.5-5.3-2.2-2.2-4.1-4.8-5.3-7.5-.4-.9-.2-2 .5-2.7l1-1.1Z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="none"
          />
          {/* confirmed checkmark */}
          <path d="M16 4l1.5 1.5L21 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
