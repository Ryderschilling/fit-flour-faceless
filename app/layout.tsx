import type { Metadata, Viewport } from 'next'
import { Anton, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { CustomCursor } from '@/components/CustomCursor'
import { SocialProofToast } from '@/components/SocialProofToast'
import { EmailPopup } from '@/components/EmailPopup'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://fitflour.shop'),
  title: {
    default: 'Fit Flour — 1:1 High-Protein Flour Substitute',
    template: '%s | Fit Flour',
  },
  description:
    'Fit Flour is the 1:1 all-purpose flour substitute with 6x the protein and ⅓ the carbs. Gluten-free, dairy-free, nut-free. Shop the Original and Gluten-Free blends.',
  keywords: ['protein flour', 'high protein flour', 'gluten-free flour', 'low carb flour', 'flour substitute', 'fit flour'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fitflour.shop',
    siteName: 'Fit Flour',
    title: 'Fit Flour — 1:1 High-Protein Flour Substitute',
    description:
      'The 1:1 flour swap that fits your goals — 6x the protein, ⅓ the carbs, no adjustments.',
    images: [
      {
        url: '/FF-social-share-1200x628.jpg',
        width: 1200,
        height: 628,
        alt: 'Fit Flour — High-Protein Flour Substitute',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fit Flour — 1:1 High-Protein Flour Substitute',
    description: 'The 1:1 flour swap with 6x the protein and ⅓ the carbs.',
    images: ['/FF-social-share-1200x628.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fit Flour',
  url: 'https://fitflour.shop',
  logo: 'https://fitflour.shop/icons/icon-512.png',
  sameAs: ['https://www.instagram.com/fitflour'],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fit Flour',
  url: 'https://fitflour.shop',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://fitflour.shop/shop?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-body">
        <CartProvider>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <SocialProofToast />
          <EmailPopup />
        </CartProvider>
      </body>
    </html>
  )
}
