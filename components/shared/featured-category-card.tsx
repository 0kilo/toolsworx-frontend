import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ConverterCard } from "@/components/shared/converter-card"
import { CategoryGroup } from "@/lib/categories"
import { ConverterMetadata } from "@/types/converter"

interface FeaturedCategoryCardProps {
  group: CategoryGroup
  converters: ConverterMetadata[]
  categoryPath: string
  cheatsheetPath: string
  maxCards?: number
}

export function FeaturedCategoryCard({
  group,
  converters,
  categoryPath,
  cheatsheetPath,
  maxCards = 4,
}: FeaturedCategoryCardProps) {
  const Icon = group.icon

  if (converters.length === 0) return null

  return (
    <Card className={`${group.color} border-2 mb-6 overflow-hidden`}>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="flex items-center gap-3">
              <div className={`${group.iconColor}`}>
                <Icon className="h-10 w-10" />
              </div>
              <h3 className={`text-3xl font-bold ${group.textColor}`}>
                {group.title}
              </h3>
            </div>
            <p className={`mt-3 text-sm ${group.textColor} opacity-80`}>
              {group.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${group.textColor} border-current/20`}>
                {converters.length}+ tools
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${group.textColor} border-current/20`}>
                Instant results
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${group.textColor} border-current/20`}>
                Mobile friendly
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link href={categoryPath} className="text-sm font-semibold underline underline-offset-4">
                View all {group.title.toLowerCase()}
              </Link>
              <Link href={cheatsheetPath} className="text-sm font-semibold underline underline-offset-4">
                Open cheat sheet
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {converters.slice(0, maxCards).map((converter) => (
              <ConverterCard key={converter.id} converter={converter} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
