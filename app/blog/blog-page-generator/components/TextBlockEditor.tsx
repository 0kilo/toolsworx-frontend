import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Link2 } from "lucide-react"
import type { FontFamily, FontSize, FontWeight, LinkItem, TextBlock, TextVariant } from "../types"

interface TextBlockEditorProps {
  block: TextBlock
  onUpdate: (next: TextBlock) => void
  onAddLink: () => void
  onUpdateLink: (linkId: string, field: keyof LinkItem, value: string) => void
  onRemoveLink: (linkId: string) => void
  onInsertSnippet: (snippet: string) => void
  onSelect: (start: number, end: number) => void
}

export function TextBlockEditor({
  block,
  onUpdate,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onInsertSnippet,
  onSelect
}: TextBlockEditorProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Variant</Label>
          <Select value={block.variant} onValueChange={(value: TextVariant) => onUpdate({ ...block, variant: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="body">Body</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={block.fontFamily} onValueChange={(value: FontFamily) => onUpdate({ ...block, fontFamily: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans-serif">Sans</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select value={block.fontWeight} onValueChange={(value: FontWeight) => onUpdate({ ...block, fontWeight: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400">400</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="600">600</SelectItem>
              <SelectItem value="700">700</SelectItem>
              <SelectItem value="800">800</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select value={block.fontSize} onValueChange={(value: FontSize) => onUpdate({ ...block, fontSize: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-xs">XS</SelectItem>
              <SelectItem value="text-sm">SM</SelectItem>
              <SelectItem value="text-base">Base</SelectItem>
              <SelectItem value="text-lg">LG</SelectItem>
              <SelectItem value="text-xl">XL</SelectItem>
              <SelectItem value="text-2xl">2XL</SelectItem>
              <SelectItem value="text-3xl">3XL</SelectItem>
              <SelectItem value="text-4xl">4XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <Input type="color" value={block.color} onChange={(e) => onUpdate({ ...block, color: e.target.value })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Text Content</Label>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onInsertSnippet("[link text](https://example.com)")}>Insert Link</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onInsertSnippet(
                  "[[img src=\"/media/your-image.jpg\" align=\"right\" width=\"half\" caption=\"Optional caption\"]]"
                )
              }
            >
              Insert Image
            </Button>
          </div>
        </div>
        <Textarea
          rows={block.variant === "header" ? 3 : 6}
          value={block.content}
          onChange={(e) => onUpdate({ ...block, content: e.target.value })}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement
            onSelect(target.selectionStart, target.selectionEnd)
          }}
          onClick={(e) => {
            const target = e.target as HTMLTextAreaElement
            onSelect(target.selectionStart, target.selectionEnd)
          }}
        />
      </div>

      {block.variant === "body" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Links</Label>
            <Button size="sm" variant="outline" onClick={onAddLink}>
              <Link2 className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
          {block.links.length === 0 && (
            <p className="text-sm text-muted-foreground">Add links to include them below this text block.</p>
          )}
          {block.links.map((link) => (
            <div key={link.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div className="space-y-1">
                <Label>Label</Label>
                <Input value={link.label} onChange={(e) => onUpdateLink(link.id, "label", e.target.value)} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>URL</Label>
                <Input value={link.href} onChange={(e) => onUpdateLink(link.id, "href", e.target.value)} />
              </div>
              <div className="flex gap-2 items-center">
                <Input type="color" value={link.color} onChange={(e) => onUpdateLink(link.id, "color", e.target.value)} />
                <Button size="icon" variant="ghost" onClick={() => onRemoveLink(link.id)}>
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
