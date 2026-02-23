import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ChangeEvent } from "react"
import type { MediaBlock, MediaSourceType, MediaType } from "../types"

interface MediaBlockEditorProps {
  block: MediaBlock
  onUpdate: (next: MediaBlock) => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

export function MediaBlockEditor({ block, onUpdate, onUpload }: MediaBlockEditorProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Media Type</Label>
          <Select value={block.mediaType} onValueChange={(value: MediaType) => onUpdate({ ...block, mediaType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Source</Label>
          <Select
            value={block.sourceType}
            onValueChange={(value: MediaSourceType) =>
              onUpdate({
                ...block,
                sourceType: value,
                url: value === "url" ? block.url : "",
                uploadedDataUrl: value === "upload" ? block.uploadedDataUrl : "",
                uploadedName: value === "upload" ? block.uploadedName : ""
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="upload">Local Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {block.sourceType === "url" ? (
        <div className="space-y-2">
          <Label>Media URL</Label>
          <Input value={block.url} onChange={(e) => onUpdate({ ...block, url: e.target.value })} />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Upload File</Label>
          <Input type="file" accept="image/*,video/*,audio/*" onChange={onUpload} />
          {block.uploadedName && (
            <p className="text-sm text-muted-foreground">Selected: {block.uploadedName}.</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Caption (optional)</Label>
        <Input value={block.caption} onChange={(e) => onUpdate({ ...block, caption: e.target.value })} />
      </div>
    </>
  )
}
