"use client"

import { Button } from "@/components/ui/button"

interface AdventureActionsProps {
  summaryText: string
  onSavePreset: () => boolean
  onLoadPreset: () => boolean
  onClearPreset: () => boolean
  exportFilename: string
  enablePdf?: boolean
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadPdfFile(filename: string, content: string) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF()
  const lines = doc.splitTextToSize(content, 180)
  doc.text(lines, 10, 12)
  doc.save(filename)
}

export function AdventureActions({
  summaryText,
  onSavePreset,
  onLoadPreset,
  onClearPreset,
  exportFilename,
  enablePdf = false,
}: AdventureActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onSavePreset()}>
        Save Preset
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onLoadPreset()}>
        Load Preset
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onClearPreset()}>
        Clear Preset
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(summaryText)
          } catch {
            // Best-effort only.
          }
        }}
      >
        Copy Summary
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => downloadTextFile(exportFilename, summaryText)}>
        Export TXT
      </Button>
      {enablePdf && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => downloadPdfFile(exportFilename.replace(/\.txt$/i, ".pdf"), summaryText)}
        >
          Export PDF
        </Button>
      )}
    </div>
  )
}
