import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import config from '@/vertical.config'
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet, isValidGa4Id } from '@/lib/theme-loader'
import Navbar from '@/components/Navbar'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import { getSiteFlags } from '@/lib/flags'
import FeedbackWidget from '@/components/FeedbackWidget'

import { MotionProvider } from "@infosiva/shared-ui/modern";
const inter = Inter({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })

export const metadata: Metadata = {
  title:       config.metaTitle,
  description: config.metaDescription,
  keywords:    config.keywords,
  metadataBase: new URL(`https://${config.domain}`),
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.metaTitle,
    description: config.metaDescription,
    images: ['/og.png'],
  },
}


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getSiteFlags('bookingcall')
  const theme = await loadSiteTheme('bookingcall')
  const themeCSS = buildThemeStyleTag(theme, { background: '#0c1a2b', primary: '#facc15', secondary: '#38bdf8' })
  const ga4 = buildGa4Snippet(theme)
  return (
    <html
      lang="en"
      className="h-full"
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": config.name,
          "url": `https://${config.domain}`,
          "description": config.metaDescription
        })}} />
      </head>
      <body className={`${inter.className} ${fraunces.variable} min-h-full flex flex-col text-white`}
        style={{ background: '#0c1a2b' }}
      >
        <Navbar />

        <main className="flex-1">
          <MotionProvider>{children}</MotionProvider>
        </main>

        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
            <span>© {new Date().getFullYear()} {config.name}. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
              <a href="/terms"   className="hover:text-white/70 transition-colors">Terms</a>
              <a href="/how-it-works" className="hover:text-white/70 transition-colors">How it works</a>
            </div>
          </div>
        </footer>
        {flags.chatbot && <FloatingChatWrapper />}
        <FeedbackWidget siteName="BookingCall" />
        {isValidGa4Id(theme?.analytics?.ga4Id) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${theme?.analytics?.ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: ga4 }} />
          </>
        )}
      </body>
    </html>
  )
}
