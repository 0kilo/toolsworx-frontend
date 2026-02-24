import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Title | ToolsWorx Blog',
  description: 'Replace with your post description.',
  alternates: { canonical: '/blog/your-post-slug' },
}

const inlineImageClass = (align: string, width: string) => {
  const w = width === 'quarter' ? 'w-1/4' : width === 'third' ? 'w-1/3' : width === 'half' ? 'w-1/2' : 'w-full'
  const alignClass = align === 'left' ? 'float-left mr-4 mb-2' : align === 'right' ? 'float-right ml-4 mb-2' : 'mx-auto'
  return w + ' ' + alignClass + ' inline-block max-w-full not-prose'
}

const renderInline = (text: string) => {
  const parts = []
  const regex = /\[\[img\s+([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[0].startsWith('[[img')) {
      const attrs = match[1]
      const src = /src="([^"]+)"/.exec(attrs)?.[1] ?? ''
      const align = /align="([^"]+)"/.exec(attrs)?.[1] ?? 'right'
      const width = /width="([^"]+)"/.exec(attrs)?.[1] ?? 'half'
      const caption = /caption="([^"]+)"/.exec(attrs)?.[1] ?? ''
      parts.push(
        <span key={'img-' + match.index} className={inlineImageClass(align, width)}>
          <img src={src} alt={caption || 'Inline image'} className="rounded-lg border max-w-full not-prose" />
          {caption ? <span className="block text-xs text-muted-foreground mt-1 not-prose">{caption}</span> : null}
        </span>
      )
      parts.push(<span key={'clr-' + match.index} className="block clear-both" />)
    } else {
      const label = match[2]
      const href = match[3]
      parts.push(
        <a key={'link-' + match.index} href={href} className="underline underline-offset-4" target="_blank" rel="noreferrer">
          {label}
        </a>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

export default function BlogPostPage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
      <h1 className="text-4xl mb-4" style={{ fontFamily: 'sans-serif', fontWeight: 700, color: '#111827' }}>{renderInline('Vietnam Coastal Loop: 4 Stops, 6 Days')}</h1>

      <p className="text-base leading-7 mb-4" style={{ fontFamily: 'sans-serif', fontWeight: 400, color: '#818892' }}>{renderInline('Published: 2026-02-22')}</p>

      <p className="text-xl leading-7 mb-4" style={{ fontFamily: 'sans-serif', fontWeight: 600, color: '#1f2937' }}>{renderInline('Overview')}</p>

      <p className="text-base leading-7 mb-4" style={{ fontFamily: 'sans-serif', fontWeight: 400, color: '#1f2937' }}>{renderInline('This ride traced the coastline from Ho Chi Minh City to Phan Thiet, then north to Phan Rang and finally to Quy Nhon. I’ve done the Ha Giang loop—cold air, mountain switchbacks, and karst peaks. This trip is the opposite: heat that gnaws at your skin and wind that forces you to lean just to keep a straight line. Ride with others and it will test your relationships. Ride solo, like I did, and it will test your resolve. If you keep asking “why?”, this isn’t for you.')}</p>

      <p className="text-base leading-7 mb-4" style={{ fontFamily: 'sans-serif', fontWeight: 400, color: '#1f2937' }}>{renderInline('I ride for the ride itself, everything else is icing. What surprised me most was how much of the trip had nothing to do with the bike. [[img src="/media/IMG_3811.JPG" align="right" width="half" caption="Optional caption"]] First, the people. Small conversations felt like invitations into their lives, and the accents shifted so much from region to region that I sometimes wondered if I was hearing a different language. Second, the food—especially the fresh seafood. The calamari soups are unforgettable. Finally, the water: starting brackish and murky, then turning turquoise clear as the days rolled north. None of that was in my equation when I left.')}</p>
      </article>
    </div>
  )
}
