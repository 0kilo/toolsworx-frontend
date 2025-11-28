import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AmplifyProvider } from '@/components/shared/amplify-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tools Worx - Free Online Conversion Tools',
  description: 'Convert files, images, videos, and more with our free online tools',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8286321884742507"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <AmplifyProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AmplifyProvider>
      </body>
    </html>
  )
}