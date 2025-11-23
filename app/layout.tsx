import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prime Properties - Find Your Dream Home',
  description: 'Modern real estate marketplace with map search, AI-powered property descriptions, and price estimates. Find your perfect property today.',
  keywords: ['real estate', 'property', 'homes for sale', 'apartments', 'houses'],
  authors: [{ name: 'Prime Properties' }],
  openGraph: {
    title: 'Prime Properties - Find Your Dream Home',
    description: 'Modern real estate marketplace with AI-powered search',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
