"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Download, Share2, FileDown } from "lucide-react"
import { AboutDescription } from "@/components/ui/about-description"

/**
 * CHART TEMPLATE
 *
 * Use this template for interactive charts that accept JSON data input.
 * Examples: Gantt charts, Flow charts, Org charts, etc.
 */

interface ChartTemplateProps {
  title: string
  description: string
  data: any
  onDataChange: (data: any) => void
  onDownload?: () => void
  onShare?: () => void
  onImport?: (url: string) => Promise<void>
  exampleJson: string
  children: React.ReactNode
  infoContent?: React.ReactNode
}

export function ChartTemplate({
  title,
  description,
  data,
  onDataChange,
  onDownload,
  onShare,
  onImport,
  exampleJson,
  children,
  infoContent
}: ChartTemplateProps) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(data, null, 2))
  const [importUrl, setImportUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleJsonUpdate = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      onDataChange(parsed)
    } catch (error) {
      alert("Invalid JSON format")
    }
  }

  const handleImport = async () => {
    if (!onImport || !importUrl.trim()) return
    
    setIsImporting(true)
    try {
      await onImport(importUrl)
      setImportUrl('')
      setIsDialogOpen(false)
    } catch (error) {
      // Error handling is done in the onImport function
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Data</CardTitle>
          <CardDescription>Configure your chart using JSON data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {onImport && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import from Google Drive</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Google Drive URL</Label>
                      <Input
                        placeholder="Paste Google Drive share URL"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        File must be publicly accessible (Anyone with the link can view)
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleImport}
                        disabled={!importUrl.trim() || isImporting}
                      >
                        {isImporting ? 'Importing...' : 'Import'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {onDownload && (
              <Button onClick={onDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            )}
            {onShare && (
              <Button onClick={onShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>JSON Data</Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="h-64 font-mono text-sm"
                placeholder="Enter JSON data..."
              />
              <Button onClick={handleJsonUpdate}>
                <Upload className="h-4 w-4 mr-2" />
                Update Chart
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Example JSON Structure</Label>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto h-64">
                {exampleJson}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <CardTitle>{data.title || "Chart"}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            {children}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      {infoContent && (
        <Card>
          <CardContent className="pt-6">{infoContent}</CardContent>
        </Card>
      )}

      {/* About Description */}
      <AboutDescription 
        title="About Gantt Charts"
        description="Create professional project timelines with tasks, dependencies, and progress tracking"
        sections={[
          {
            title: "What is a Gantt Chart?",
            content: ["A Gantt chart is a visual project management tool that displays tasks, timelines, and dependencies in a horizontal bar chart format."]
          },
          {
            title: "Key Features",
            content: ["Support for task dependencies", "Progress tracking", "Recurring events", "Interactive timeline views"]
          }
        ]}
      />
    </div>
  )
}