import BookingChatWidget from '@/components/BookingChatWidget'
import { theme } from '@/lib/theme'
import config from '@/vertical.config'

export const metadata = {
  title: `Book Your Appointment — ${config.name}`,
}

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-bold ${theme.gradientText}`}>Book your appointment</h1>
          <p className="text-white/45 text-sm mt-1">
            Chat with our AI — we call the salon to confirm your slot
          </p>
        </div>
        <div className={`${theme.card} rounded-2xl overflow-hidden ${theme.glow}`} style={{ minHeight: 520 }}>
          <BookingChatWidget />
        </div>
        <p className="text-center text-white/30 text-xs mt-4">
          📞 We make a real call to the salon on your behalf — no hold music for you
        </p>
      </div>
    </div>
  )
}
