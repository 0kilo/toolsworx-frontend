import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/seo/structured-data"
import { PageLoadingIndicator } from "@/components/ui/page-loading"
import { FloatingButton } from "@/components/ui/floating-button"
import { siteConfig } from "@/config/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Free Online Conversion Tools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - Free Online Conversion Tools`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Free Online Conversion Tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Conversion Tools`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@toolsworx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com; object-src 'none';" />
        <link rel="icon" href="/favicon-16x16.png" />

        {siteConfig.adsense.enabled && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.client}`}
            crossOrigin="anonymous"
          />
        )}
        {siteConfig.analytics.googleAnalytics && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.googleAnalytics}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.analytics.googleAnalytics}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <PageLoadingIndicator />
        <FloatingButton />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
