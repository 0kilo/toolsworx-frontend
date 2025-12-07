export const siteConfig = {
  name: "TOOLS WORX",
  description: "Free online conversion tools for documents, images, videos, and unit calculations. Convert files and measurements instantly with 88+ professional tools.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://toolsworx.com",
  ogImage: "https://toolsworx.com/og-image.png",
  keywords: [
    "converter", "conversion tools", "file converter", "image converter", 
    "video converter", "audio converter", "unit converter", "calculator",
    "free online tools", "document converter", "pdf converter"
  ],
  links: {
    github: "https://github.com/yourusername/convert-all",
  },
  adsense: {
    client: "ca-pub-8286321884742507",
    enabled: true,
  },
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
  },
}

export type SiteConfig = typeof siteConfig
