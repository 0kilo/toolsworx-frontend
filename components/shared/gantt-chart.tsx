"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import * as d3 from "d3"
import { RRule } from "rrule"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ShareComponent } from "./share-component"
import { GoogleDriveService } from "@/lib/services/google-drive-service"
import { Upload, Download, Share2, Plus, X, Cloud } from "lucide-react"

interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  dependencies?: string[]
  recurrence?: string
}

interface GanttData {
  title: string
  tasks: GanttTask[]
}

const exampleData: GanttData = {
  title: "Project Timeline",
  tasks: [
    {
      id: "task1",
      name: "Planning Phase",
      start: "2024-01-01",
      end: "2024-01-15",
      progress: 100
    },
    {
      id: "task2", 
      name: "Development",
      start: "2024-01-10",
      end: "2024-02-28",
      progress: 60,
      dependencies: ["task1"]
    },
    {
      id: "task3",
      name: "Testing",
      start: "2024-02-20",
      end: "2024-03-15",
      progress: 20,
      dependencies: ["task2"]
    }
  ]
}

export function GanttChart() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(exampleData, null, 2))
  const [data, setData] = useState<GanttData>(exampleData)
  const [showShare, setShowShare] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showDriveLoader, setShowDriveLoader] = useState(false)
  const [driveFileId, setDriveFileId] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const renderChart = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 50, right: 50, bottom: 50, left: 200 }
    const containerWidth = svgRef.current?.parentElement?.clientWidth || 1200
    const width = containerWidth - margin.left - margin.right
    const height = data.tasks.length * 60 + margin.top + margin.bottom

    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height)

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`)

    // Parse dates and expand recurring tasks
    const parseDate = d3.timeParse("%Y-%m-%d")
    const expandedTasks: any[] = []
    
    data.tasks.forEach(task => {
      if (task.recurrence) {
        try {
          const rule = RRule.fromString(task.recurrence)
          const occurrences = rule.between(parseDate(task.start)!, parseDate(task.end)!)
          occurrences.forEach((date, index) => {
            expandedTasks.push({
              ...task,
              id: `${task.id}_${index}`,
              name: `${task.name} #${index + 1}`,
              startDate: date,
              endDate: new Date(date.getTime() + 24 * 60 * 60 * 1000) // 1 day duration
            })
          })
        } catch (error) {
          console.error('Invalid recurrence rule:', task.recurrence)
          expandedTasks.push({
            ...task,
            startDate: parseDate(task.start)!,
            endDate: parseDate(task.end)!
          })
        }
      } else {
        expandedTasks.push({
          ...task,
          startDate: parseDate(task.start)!,
          endDate: parseDate(task.end)!
        })
      }
    })
    
    const tasks = expandedTasks

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(tasks.flatMap(t => [t.startDate, t.endDate])) as [Date, Date])
      .range([0, width])

    const yScale = d3.scaleBand()
      .domain(tasks.map((t, i) => t.name || `Task ${i}`))
      .range([0, tasks.length * 50])
      .padding(0.1)

    // Axes
    g.append("g")
     .attr("transform", `translate(0,${tasks.length * 50})`)
     .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d") as any))

    g.append("g")
     .call(d3.axisLeft(yScale))

    // Vertical grid lines
    g.selectAll(".grid-line")
     .data(xScale.ticks())
     .enter().append("line")
     .attr("class", "grid-line")
     .attr("x1", d => xScale(d))
     .attr("x2", d => xScale(d))
     .attr("y1", 0)
     .attr("y2", tasks.length * 50)
     .attr("stroke", "#e0e0e0")
     .attr("stroke-width", 0.5)
     .attr("opacity", 1)

    // Task bars
    const taskBars = g.selectAll(".task")
      .data(tasks)
      .enter().append("g")
      .attr("class", "task")

    taskBars.append("rect")
      .attr("x", d => xScale(d.startDate))
      .attr("y", d => yScale(d.name)!)
      .attr("width", d => xScale(d.endDate) - xScale(d.startDate))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => d.recurrence ? "#f59e0b" : "#3b82f6")
      .attr("opacity", d => d.recurrence ? 0.8 : 0.7)
      .attr("rx", d => d.recurrence ? 3 : 0)

    // Progress bars
    taskBars.append("rect")
      .attr("x", d => xScale(d.startDate))
      .attr("y", d => yScale(d.name)!)
      .attr("width", d => (xScale(d.endDate) - xScale(d.startDate)) * (d.progress || 0) / 100)
      .attr("height", yScale.bandwidth())
      .attr("fill", "#10b981")

    // Task labels
    taskBars.append("text")
      .attr("x", d => xScale(d.startDate) + 5)
      .attr("y", d => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => `${d.progress || 0}%`)

    // Title
    svg.append("text")
       .attr("x", (width + margin.left + margin.right) / 2)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .attr("font-weight", "bold")
       .text(data.title)
  }, [data])

  useEffect(() => {
    if (data.tasks.length > 0) {
      renderChart()
    }
  }, [data, renderChart])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const driveId = urlParams.get('drive')
    const jsonUrl = urlParams.get('url')
    
    if (driveId) {
      loadFromDrive(driveId)
    } else if (jsonUrl) {
      loadFromUrl(jsonUrl)
    }
  }, [])

  const loadFromUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      
      const chartData = await response.json()
      if (chartData && chartData.title && chartData.tasks) {
        setData(chartData)
        setJsonInput(JSON.stringify(chartData, null, 2))
      } else {
        throw new Error('Invalid chart format')
      }
    } catch (error) {
      console.error('Failed to load from URL:', error)
      alert('Failed to load chart from URL. Please check the URL and try again.')
    }
  }

  const loadFromDrive = async (fileId: string) => {
    try {
      const chartData = await GoogleDriveService.loadChart(fileId)
      if (chartData) {
        setData(chartData)
        setJsonInput(JSON.stringify(chartData, null, 2))
        setDriveFileId(fileId)
      }
    } catch (error) {
      console.error('Failed to load from Drive:', error)
    }
  }

  const saveToDrive = async () => {
    try {
      const fileId = await GoogleDriveService.saveChart(data, data.title)
      if (fileId) {
        setDriveFileId(fileId)
        const shareUrl = GoogleDriveService.generateShareUrl(fileId)
        navigator.clipboard.writeText(shareUrl)
        alert('Chart saved to Google Drive! Share URL copied to clipboard.')
      } else {
        alert('Failed to save to Google Drive. Please check your authentication.')
      }
    } catch (error) {
      console.error('Failed to save to Drive:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('credentials not configured')) {
        alert('Google Drive integration requires API credentials. Use the URL sharing method instead.')
      } else if (errorMessage.includes('authentication')) {
        alert('Google Drive authentication required. Please configure API credentials.')
      } else {
        alert('Failed to save to Google Drive')
      }
    }
  }

  const handleJsonUpdate = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setData(parsed)
    } catch (error) {
      alert("Invalid JSON format")
    }
  }

  const downloadChart = () => {
    const svg = svgRef.current
    if (!svg) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.title.replace(/\s+/g, "_")}_gantt.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateChartImage = () => {
    const svg = svgRef.current
    if (!svg) return null

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    
    return new Promise<string>((resolve) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/png"))
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgString)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gantt Chart Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowBuilder(!showBuilder)}>
              <Plus className="h-4 w-4 mr-2" />
              Property Builder
            </Button>
            <Button onClick={downloadChart} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download SVG
            </Button>
            {process.env.NEXT_PUBLIC_GOOGLE_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <>
                <Button onClick={saveToDrive} variant="outline">
                  <Cloud className="h-4 w-4 mr-2" />
                  Save to Drive
                </Button>
                <Button onClick={() => setShowDriveLoader(true)} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Load from Drive
                </Button>
              </>
            ) : null}
            <Button onClick={() => setShowShare(true)} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {showBuilder && <PropertyBuilder data={data} onChange={setData} />}

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
{`{
  "title": "Project Timeline",
  "tasks": [
    {
      "id": "task1",
      "name": "Planning Phase", 
      "start": "2024-01-01",
      "end": "2024-01-15",
      "progress": 100
    },
    {
      "id": "task2",
      "name": "Development",
      "start": "2024-01-10", 
      "end": "2024-02-28",
      "progress": 60,
      "dependencies": ["task1"]
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{data.title}</h3>
            <Button onClick={() => setShowShare(true)} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Chart
            </Button>
          </div>
          <div className="overflow-x-auto">
            <svg ref={svgRef}></svg>
          </div>
        </CardContent>
      </Card>

      {showShare && (
        <ChartShareComponent
          data={data}
          generateImage={generateChartImage}
          onClose={() => setShowShare(false)}
        />
      )}

      {showDriveLoader && (
        <DriveLoaderComponent
          onLoad={(chartData) => {
            setData(chartData)
            setJsonInput(JSON.stringify(chartData, null, 2))
            setShowDriveLoader(false)
          }}
          onClose={() => setShowDriveLoader(false)}
        />
      )}
    </div>
  )
}

function ChartShareComponent({ data, generateImage, onClose }: { 
  data: GanttData, 
  generateImage: () => Promise<string> | null,
  onClose: () => void 
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateImage = async () => {
    setLoading(true)
    try {
      const result = await generateImage()
      if (result) {
        setImageUrl(result)
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
    setLoading(false)
  }

  const handleShare = async () => {
    if (!imageUrl) {
      await handleGenerateImage()
      return
    }

    if (navigator.share) {
      try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `${data.title}_gantt.png`, { type: 'image/png' })
        await navigator.share({
          title: `${data.title} - Gantt Chart`,
          files: [file]
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <Card className="fixed inset-0 z-50 m-4 max-w-md mx-auto mt-20 h-fit shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Chart
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="space-y-2">
            <Label>Chart Preview</Label>
            <img src={imageUrl} alt="Chart preview" className="w-full border rounded" />
          </div>
        )}
        
        <Button 
          onClick={imageUrl ? handleShare : handleGenerateImage}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Generating..." : imageUrl ? "Share Image" : "Generate Image"}
        </Button>
      </CardContent>
    </Card>
  )
}

function DriveLoaderComponent({ onLoad, onClose }: {
  onLoad: (data: GanttData) => void
  onClose: () => void
}) {
  const [fileId, setFileId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoad = async () => {
    if (!fileId.trim()) return
    
    setLoading(true)
    try {
      const chartData = await GoogleDriveService.loadChart(fileId.trim())
      if (chartData) {
        onLoad(chartData)
      } else {
        alert('Failed to load chart from Google Drive')
      }
    } catch (error) {
      console.error('Load failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('authentication')) {
        alert('Google Drive authentication required. Please configure API credentials.')
      } else {
        alert('Failed to load chart from Google Drive. Check the file ID and try again.')
      }
    }
    setLoading(false)
  }

  return (
    <Card className="fixed inset-0 z-50 m-4 max-w-md mx-auto mt-20 h-fit shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Load from Google Drive
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Google Drive File ID</Label>
          <Input
            placeholder="Enter file ID from Drive URL"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Copy the file ID from the Google Drive share URL
          </p>
        </div>
        
        <Button 
          onClick={handleLoad}
          disabled={loading || !fileId.trim()}
          className="w-full"
        >
          {loading ? "Loading..." : "Load Chart"}
        </Button>
      </CardContent>
    </Card>
  )
}

function PropertyBuilder({ data, onChange }: { data: GanttData, onChange: (data: GanttData) => void }) {
  const [title, setTitle] = useState(data.title)
  const [tasks, setTasks] = useState(data.tasks)

  const addTask = () => {
    const newTask: GanttTask = {
      id: `task${tasks.length + 1}`,
      name: "New Task",
      start: "2024-01-01",
      end: "2024-01-07",
      progress: 0
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (index: number, field: keyof GanttTask, value: any) => {
    const updated = [...tasks]
    updated[index] = { ...updated[index], [field]: value }
    setTasks(updated)
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const generateJson = () => {
    const newData = { title, tasks }
    onChange(newData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Chart Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Tasks</Label>
            <Button onClick={addTask} size="sm">Add Task</Button>
          </div>
          
          {tasks.map((task, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 p-2 border rounded">
              <Input
                placeholder="Task name"
                value={task.name}
                onChange={(e) => updateTask(index, 'name', e.target.value)}
              />
              <Input
                type="date"
                value={task.start}
                onChange={(e) => updateTask(index, 'start', e.target.value)}
              />
              <Input
                type="date"
                value={task.end}
                onChange={(e) => updateTask(index, 'end', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Progress %"
                value={task.progress || 0}
                onChange={(e) => updateTask(index, 'progress', parseInt(e.target.value))}
              />
              <Input
                placeholder="Recurrence (RRULE)"
                value={task.recurrence || ''}
                onChange={(e) => updateTask(index, 'recurrence', e.target.value)}
              />
              <Button onClick={() => removeTask(index)} variant="destructive" size="sm">
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={generateJson}>Generate Chart</Button>
      </CardContent>
    </Card>
  )
}