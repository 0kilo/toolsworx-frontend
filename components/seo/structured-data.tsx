interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TOOLS WORX',
    url: 'https://toolsworx.com',
    description: 'Free online conversion tools for documents, images, videos, and unit calculations',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://toolsworx.com/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return <StructuredData data={data} />
}

export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TOOLS WORX',
    url: 'https://toolsworx.com',
    logo: 'https://toolsworx.com/logo150.png',
    description: 'Free online conversion tools for documents, images, videos, and unit calculations',
    sameAs: [
      'https://github.com/toolsworx',
    ],
  }

  return <StructuredData data={data} />
}