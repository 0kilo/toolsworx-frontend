import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AboutDescriptionProps {
  title: string
  description: string
  sections: {
    title: string
    content: string[] | { title: string; items: string[] }[]
    type?: 'list' | 'subsections'
  }[]
}

export function AboutDescription({ title, description, sections }: AboutDescriptionProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
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
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                {Array.isArray(section.content) ? (section.content as string[]).map((item: string, itemIndex: number) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                )) : null}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}