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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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