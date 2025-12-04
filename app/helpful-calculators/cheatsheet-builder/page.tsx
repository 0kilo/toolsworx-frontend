"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AboutDescription } from "@/components/ui/about-description"
import { Plus, Trash2, Download, FileText, GripVertical, ArrowUp, ArrowDown, BookOpen } from "lucide-react"
import { CheatsheetData, CheatsheetItem, CheatsheetLayout, CheatsheetFontSize, CheatsheetColorScheme } from "@/types/cheatsheet"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import katex from "katex"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"
import "katex/dist/katex.min.css"
import appData from "@/app/app.json"
import toolContent from "./cheatsheet-builder.json"

interface ToolData {
  id: string
  title: string
  category: string
  sections: Array<{
    title: string
    type?: string
    content: string[]
  }>
}

export default function CheatsheetBuilderPage() {
  const [cheatsheet, setCheatsheet] = useState<CheatsheetData>({
    title: "My Cheatsheet",
    date: new Date().toISOString().split('T')[0],
    subject: "Mathematics",
    author: "",
    category: "",
    layout: "double",
    fontSize: "medium",
    colorScheme: "default",
    items: [
      {
        id: crypto.randomUUID(),
        subtitle: "Example Section",
        description: "Add your content here. Use $x^2$ for inline math or $$\\frac{a}{b}$$ for display math.",
        type: "text",
        importance: "normal"
      }
    ]
  })
  const [availableTools, setAvailableTools] = useState<ToolData[]>([])
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set())
  const [isLoadingTools, setIsLoadingTools] = useState(false)
  const [previewOrientation, setPreviewOrientation] = useState<'portrait' | 'landscape'>('portrait')

  // Load all tools
  useEffect(() => {
    const loadTools = async () => {
      setIsLoadingTools(true)
      const tools: ToolData[] = []
      
      for (const category of appData.categories) {
        try {
          const categoryData = await import(`@/app/${category}/${category}.json`)
          const toolIds = categoryData.default?.tools || categoryData.tools || []
          
          for (const toolId of toolIds) {
            try {
              const toolData = await import(`@/app/${category}/${toolId}/${toolId}.json`)
              tools.push({
                id: toolData.default?.id || toolData.id,
                title: toolData.default?.title || toolData.title,
                category,
                sections: toolData.default?.sections || toolData.sections || []
              })
            } catch (e) {
              console.warn(`Failed to load tool ${toolId}:`, e)
            }
          }
        } catch (e) {
          console.warn(`Failed to load category ${category}:`, e)
        }
      }
      
      setAvailableTools(tools)
      setIsLoadingTools(false)
    }
    
    loadTools()
  }, [])

  // Update cheatsheet field
  const updateField = (field: keyof CheatsheetData, value: any) => {
    setCheatsheet(prev => ({ ...prev, [field]: value }))
  }

  // Add tools to cheatsheet
  const addSelectedTools = () => {
    const toolsToAdd = availableTools.filter(tool => selectedTools.has(tool.id))
    const newItems: CheatsheetItem[] = []
    
    toolsToAdd.forEach(tool => {
      tool.sections.forEach(section => {
        newItems.push({
          id: crypto.randomUUID(),
          subtitle: `${tool.title} - ${section.title}`,
          description: section.content.join('\n'),
          type: "text",
          importance: "normal"
        })
      })
    })
    
    setCheatsheet(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }))
    setSelectedTools(new Set())
  }

  // Add new item
  const addItem = () => {
    const newItem: CheatsheetItem = {
      id: crypto.randomUUID(),
      subtitle: "New Section",
      description: "",
      type: "text",
      importance: "normal"
    }
    setCheatsheet(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  // Remove item
  const removeItem = (id: string) => {
    setCheatsheet(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  // Update item
  const updateItem = (id: string, field: keyof CheatsheetItem, value: any) => {
    setCheatsheet(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  // Move item up
  const moveItemUp = (index: number) => {
    if (index === 0) return
    setCheatsheet(prev => {
      const newItems = [...prev.items]
      ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
      return { ...prev, items: newItems }
    })
  }

  // Move item down
  const moveItemDown = (index: number) => {
    if (index === cheatsheet.items.length - 1) return
    setCheatsheet(prev => {
      const newItems = [...prev.items]
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      return { ...prev, items: newItems }
    })
  }

  // Render LaTeX
  const renderLatex = (text: string) => {
    try {
      // Handle display math $$...$$
      let rendered = text.replace(/\$\$(.*?)\$\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: true, throwOnError: false })
        } catch {
          return match
        }
      })

      // Handle inline math $...$
      rendered = rendered.replace(/\$(.*?)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: false, throwOnError: false })
        } catch {
          return match
        }
      })

      return rendered
    } catch {
      return text
    }
  }

  // Export to TXT
  const exportToTXT = () => {
    let text = `${cheatsheet.title}\n`
    text += `${'='.repeat(cheatsheet.title.length)}\n\n`
    text += `Subject: ${cheatsheet.subject}\n`
    text += `Date: ${cheatsheet.date}\n`
    if (cheatsheet.author) text += `Author: ${cheatsheet.author}\n`
    text += `\n`

    cheatsheet.items.forEach((item, index) => {
      text += `${index + 1}. ${item.subtitle}\n`
      text += `${'-'.repeat(item.subtitle.length + 3)}\n`
      text += `${item.description}\n\n`
    })

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${cheatsheet.title.replace(/\s+/g, '-')}.txt`)
  }

  // Export to PDF
  const exportToPDF = async () => {
    const element = document.getElementById('cheatsheet-preview')
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${cheatsheet.title.replace(/\s+/g, '-')}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    }
  }

  // Export to JSON
  const exportToJSON = () => {
    const json = JSON.stringify(cheatsheet, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    saveAs(blob, `${cheatsheet.title.replace(/\s+/g, '-')}.json`)
  }

  // Import from JSON
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Add IDs to items if missing
        if (data.items) {
          data.items = data.items.map((item: any) => ({
            ...item,
            id: item.id || crypto.randomUUID()
          }))
        }
        setCheatsheet(data)
      } catch (error) {
        console.error('Failed to import JSON:', error)
      }
    }
    reader.readAsText(file)
  }

  const colorSchemes = {
    default: { bg: 'bg-white', header: 'bg-slate-100', text: 'text-slate-900', accent: 'border-slate-300' },
    blue: { bg: 'bg-blue-50', header: 'bg-blue-100', text: 'text-blue-900', accent: 'border-blue-300' },
    green: { bg: 'bg-green-50', header: 'bg-green-100', text: 'text-green-900', accent: 'border-green-300' },
    purple: { bg: 'bg-purple-50', header: 'bg-purple-100', text: 'text-purple-900', accent: 'border-purple-300' },
    red: { bg: 'bg-red-50', header: 'bg-red-100', text: 'text-red-900', accent: 'border-red-300' },
  }

  const currentScheme = colorSchemes[cheatsheet.colorScheme || 'default']
  const fontSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  const currentFontSize = fontSizes[cheatsheet.fontSize || 'medium']

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
        <p className="text-muted-foreground">
          {toolContent.pageDescription}
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {/* FORM BUILDER */}
        <Card>
          <CardHeader>
            <CardTitle>Build Your Cheatsheet</CardTitle>
            <CardDescription>Fill in the details and add your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Metadata */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={cheatsheet.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Calculus I Quick Reference"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={cheatsheet.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={cheatsheet.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input
                id="author"
                value={cheatsheet.author || ''}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Styling Options */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Styling Options</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={cheatsheet.layout}
                    onValueChange={(value) => updateField('layout', value as CheatsheetLayout)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Column</SelectItem>
                      <SelectItem value="double">Double Column</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={cheatsheet.fontSize}
                    onValueChange={(value) => updateField('fontSize', value as CheatsheetFontSize)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color</Label>
                  <Select
                    value={cheatsheet.colorScheme}
                    onValueChange={(value) => updateField('colorScheme', value as CheatsheetColorScheme)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Content Items</h3>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Add from Tools
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Select Tools</DialogTitle>
                        <DialogDescription>
                          Choose tools to add their formulas and content to your cheatsheet
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {isLoadingTools ? (
                          <p className="text-center text-muted-foreground">Loading tools...</p>
                        ) : (
                          <>
                            {appData.categories.map(category => {
                              const categoryTools = availableTools.filter(t => t.category === category)
                              if (categoryTools.length === 0) return null
                              
                              return (
                                <div key={category} className="space-y-2">
                                  <h4 className="font-medium capitalize">{category.replace(/-/g, ' ')}</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {categoryTools.map(tool => (
                                      <div key={tool.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={tool.id}
                                          checked={selectedTools.has(tool.id)}
                                          onCheckedChange={(checked) => {
                                            const newSelected = new Set(selectedTools)
                                            if (checked) {
                                              newSelected.add(tool.id)
                                            } else {
                                              newSelected.delete(tool.id)
                                            }
                                            setSelectedTools(newSelected)
                                          }}
                                        />
                                        <label
                                          htmlFor={tool.id}
                                          className="text-sm cursor-pointer"
                                        >
                                          {tool.title}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                            <Button
                              onClick={addSelectedTools}
                              disabled={selectedTools.size === 0}
                              className="w-full"
                            >
                              Add {selectedTools.size} Tool{selectedTools.size !== 1 ? 's' : ''}
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {cheatsheet.items.map((item, index) => (
                  <Card key={item.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={item.subtitle}
                          onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                          placeholder="Section title"
                          className="flex-1"
                        />
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItemDown(index)}
                            disabled={index === cheatsheet.items.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Content (use $x^2$ for math)"
                        rows={3}
                        className="font-mono text-xs"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Import/Export */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToJSON} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <label className="flex-1">
                  <Button variant="outline" className="w-full cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Import JSON
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importFromJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your cheatsheet looks</CardDescription>
              </div>
              <Select
                value={previewOrientation}
                onValueChange={(value) => setPreviewOrientation(value as 'portrait' | 'landscape')}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div
              id="cheatsheet-preview"
              className={`p-6 rounded-lg border-2 ${currentScheme.bg} ${currentScheme.text} ${currentScheme.accent} ${previewOrientation === 'landscape' ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto'}`}
              style={previewOrientation === 'landscape' ? { aspectRatio: '1.414/1' } : { aspectRatio: '1/1.414' }}
            >
              {/* Header */}
              <div className={`p-4 rounded-lg mb-4 ${currentScheme.header}`}>
                <h1 className="text-2xl font-bold mb-1">{cheatsheet.title}</h1>
                <div className="flex gap-4 text-sm">
                  <span className="font-medium">{cheatsheet.subject}</span>
                  <span>•</span>
                  <span>{cheatsheet.date}</span>
                  {cheatsheet.author && (
                    <>
                      <span>•</span>
                      <span>{cheatsheet.author}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={cheatsheet.layout === 'double' ? 'columns-2 gap-4' : ''}>
                {cheatsheet.items.map((item, index) => (
                  <div key={item.id} className="mb-4 break-inside-avoid">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                      {item.subtitle}
                      {item.importance === 'high' && (
                        <Badge variant="destructive" className="text-xs">Important</Badge>
                      )}
                    </h3>
                    <div
                      className={`${currentFontSize} leading-relaxed`}
                      dangerouslySetInnerHTML={{ __html: renderLatex(item.description) }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2 mt-4">
              <Button onClick={exportToPDF} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={exportToTXT} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export TXT
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AboutDescription
        title={toolContent.aboutTitle}
        description={toolContent.aboutDescription}
        sections={toolContent.sections}
      />
    </div>
  )
}
