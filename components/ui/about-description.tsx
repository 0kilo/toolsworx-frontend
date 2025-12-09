"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import "katex/dist/katex.min.css"

interface AboutDescriptionProps {
  title: string
  description: string
  sections: {
    title: string
    content: string[] | { title: string; items: string[] }[]
    type?: 'list' | 'subsections' | string
  }[]
}

export function AboutDescription({ title, description, sections }: AboutDescriptionProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && contentRef.current) {
      // Dynamically load KaTeX
      const loadKaTeX = async () => {
        const katex = await import('katex')
        
        // Render all math expressions
        const mathElements = contentRef.current?.querySelectorAll('.math-inline')
        mathElements?.forEach((element) => {
          const tex = element.textContent || ''
          try {
            katex.default.render(tex, element as HTMLElement, {
              throwOnError: false,
              displayMode: false
            })
          } catch (e) {
            console.error('KaTeX render error:', e)
          }
        })
      }
      loadKaTeX()
    }
  }, [sections])

  const processLatex = (text: string) => {
    // Replace $...$ with span elements for inline math
    return text.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6" ref={contentRef}>
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
            {section.type === 'subsections' ? (
              <div className="space-y-4">
                {(section.content as { title: string; items: string[] }[]).map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h4 className="font-medium mb-2">{subsection.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      {subsection.items.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: processLatex(item) }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                {Array.isArray(section.content) ? (section.content as string[]).map((item: string, itemIndex: number) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: processLatex(item) }} />
                )) : null}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
