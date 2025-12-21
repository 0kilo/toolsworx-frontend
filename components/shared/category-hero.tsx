import { Card, CardContent } from "@/components/ui/card"
import { CategoryGroup } from "@/lib/categories"
import { Check } from "lucide-react"

interface CategoryHeroProps {
  category: CategoryGroup
  toolCount: number
  eyebrow?: string
  chips?: string[]
}

export function CategoryHero({ category, toolCount, eyebrow, chips }: CategoryHeroProps) {
  const Icon = category.icon
  const chipList = chips?.length
    ? chips
    : [`${toolCount}+ tools`, "Fast results", "Mobile friendly"]

  return (
    <Card className={`${category.color} border-2 mb-10`}>
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className={`${category.iconColor}`}>
                <Icon className="h-14 w-14" />
              </div>
              <div>
                {eyebrow && (
                  <p className={`text-xs uppercase tracking-wide ${category.textColor} opacity-70`}>
                    {eyebrow}
                  </p>
                )}
                <h1 className={`text-4xl font-bold ${category.textColor}`}>
                  {category.title}
                </h1>
              </div>
            </div>
            <p className={`text-base mt-3 ${category.textColor} opacity-85`}>
              {category.longDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {chipList.map((chip) => (
              <span
                key={chip}
                className={`text-xs px-3 py-1 rounded-full border ${category.textColor} border-current/20`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {category.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className={`h-5 w-5 mt-0.5 ${category.iconColor}`} />
              <span className={`text-sm ${category.textColor} opacity-80`}>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
