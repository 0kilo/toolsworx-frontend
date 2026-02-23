import { Button } from "@/components/ui/button"
import { ImageIcon, Plus, Type } from "lucide-react"
import type { TextVariant } from "../types"

interface ToolboxProps {
  onAddText: (variant: TextVariant) => void
  onAddMedia: () => void
  onImport: () => void
}

export function Toolbox({ onAddText, onAddMedia, onImport }: ToolboxProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => onAddText("header")} variant="outline">
        <Type className="h-4 w-4 mr-2" />
        Add Header Text
      </Button>
      <Button onClick={() => onAddText("body")} variant="outline">
        <Type className="h-4 w-4 mr-2" />
        Add Body Text
      </Button>
      <Button onClick={onAddMedia} variant="outline">
        <ImageIcon className="h-4 w-4 mr-2" />
        Add Media
      </Button>
      <Button onClick={onImport} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Import TSX
      </Button>
    </div>
  )
}
