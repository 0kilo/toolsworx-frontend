"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ShareComponent } from "./share-component"
import { Upload, Download, Share2, Plus } from "lucide-react"

interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  dependencies?: string[]
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
  const svgRef = useRef<SVGSVGElement>(null)

  const renderChart = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 50, right: 50, bottom: 50, left: 200 }
    const width = 800 - margin.left - margin.right
    const height = data.tasks.length * 60 + margin.top + margin.bottom

    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height)

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`)

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d")
    const tasks = data.tasks.map(task => ({
      ...task,
      startDate: parseDate(task.start)!,
      endDate: parseDate(task.end)!
    }))

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(tasks.flatMap(t => [t.startDate, t.endDate])) as [Date, Date])
      .range([0, width])

    const yScale = d3.scaleBand()
      .domain(tasks.map(t => t.name))
      .range([0, tasks.length * 50])
      .padding(0.1)

    // Axes
    g.append("g")
     .attr("transform", `translate(0,${tasks.length * 50})`)
     .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d") as any))

    g.append("g")
     .call(d3.axisLeft(yScale))

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
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.7)

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
          <div className="overflow-x-auto">
            <svg ref={svgRef}></svg>
          </div>
        </CardContent>
      </Card>

      {showShare && (
        <ShareComponent
          content={jsonInput}
          title={`${data.title} - Gantt Chart`}
          type="text"
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
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
            <div key={index} className="grid grid-cols-5 gap-2 p-2 border rounded">
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