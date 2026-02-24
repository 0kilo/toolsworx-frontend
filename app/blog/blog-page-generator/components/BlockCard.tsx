import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import type { ReactNode } from "react"

interface BlockCardProps {
  title: string
  index: number
  total: number
  collapsed: boolean
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  children: ReactNode
}

export function BlockCard({
  title,
  index,
  total,
  collapsed,
  onToggle,
  onMoveUp,
  onMoveDown,
  onRemove,
  children
}: BlockCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Block {index + 1}: {title}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onToggle} aria-label={collapsed ? "Expand" : "Collapse"}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onMoveUp} disabled={index === 0}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onMoveDown} disabled={index === total - 1}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {!collapsed && <CardContent className="space-y-4">{children}</CardContent>}
    </Card>
  )
}
