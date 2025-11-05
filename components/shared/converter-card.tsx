import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConverterMetadata } from "@/types/converter"
import { Badge } from "@/components/ui/badge"

interface ConverterCardProps {
  converter: ConverterMetadata
}

export function ConverterCard({ converter }: ConverterCardProps) {
  const Icon = converter.icon

  return (
    <Link href={converter.href}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <Icon className="h-8 w-8 mb-2 text-primary" />
            {converter.popular && (
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg">{converter.title}</CardTitle>
          <CardDescription>{converter.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
