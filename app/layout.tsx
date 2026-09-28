import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://boommedia.in'),
  title: {
    default: 'BoomMedia — Online Influence + Offline Reach',
    template: '%s | BoomMedia',
  },
  description:
    'Connect your brand with micro-influencers and high-visibility vehicle advertising campaigns from one powerful platform.',
  keywords: [
    'influencer marketing',
    'vehicle advertising',
    'brand marketing',
    'micro-influencer',
    'India',
  ],
  openGraph: {
    type: 'website',
    siteName: 'BoomMedia',
    title: 'BoomMedia — Online Influence + Offline Reach',
    description:
      'Connect your brand with micro-influencers and high-visibility vehicle advertising from one platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoomMedia',
    description:
      'Online Influence + Offline Reach. Brands, influencers, and vehicle advertising — one platform.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
