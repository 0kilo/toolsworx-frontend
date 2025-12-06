import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AmplifyProvider } from '@/components/shared/amplify-provider'
import { OrganizationSchema, WebApplicationSchema } from './schema'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://toolsworx.com'),
  title: {
    default: 'Tools Worx - Free Online Conversion Tools',
    template: '%s | Tools Worx'
  },
  description: 'Convert files, images, videos, and more with our free online tools. 88+ professional converters for documents, media, units, and calculations.',
  keywords: ['file converter', 'image converter', 'video converter', 'pdf converter', 'unit converter', 'free online tools', 'document converter'],
  authors: [{ name: 'Tools Worx' }],
  creator: 'Tools Worx',
  publisher: 'Tools Worx',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolsworx.com',
    siteName: 'Tools Worx',
    title: 'Tools Worx - Free Online Conversion Tools',
    description: 'Convert files, images, videos instantly. 88+ free professional conversion tools.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Tools Worx - Free Online Conversion Tools'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools Worx - Free Online Conversion Tools',
    description: 'Convert files, images, videos instantly. 88+ free professional tools.',
    images: ['/og-image.jpg'],
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
          src="https://www.googletagmanager.com/gtag/js?id=G-6KELGGJCTR"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6KELGGJCTR');
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8286321884742507"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <OrganizationSchema />
        <WebApplicationSchema />
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