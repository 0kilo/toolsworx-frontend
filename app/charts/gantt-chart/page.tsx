"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { RRule } from "rrule"
import { ChartTemplate } from "@/components/shared/chart-template"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as d3 from "d3"

interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  dependencies?: string[]
}

interface GanttRecurrence {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  freq: string
  interval?: number
  byday?: string
}

interface GanttData {
  title: string
  startDate?: string
  endDate?: string
  tasks: GanttTask[]
  recurrences?: GanttRecurrence[]
}

const exampleData: GanttData = {
  title: "Project Timeline",
  startDate: "2024-01-01",
  endDate: "2024-04-30",
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

const exampleJson = `{
  "title": "Project Timeline",
  "startDate": "2024-01-01",
  "endDate": "2024-04-30",
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
}`

export default function GanttChartPage() {
  const [data, setData] = useState<GanttData>(exampleData)
  const [resolution, setResolution] = useState<number>(7)
  const ganttRef = useRef<HTMLDivElement>(null)

  const renderChart = useCallback(() => {
    if (!ganttRef.current) return

    const expandedTasks: any[] = []
    const projectStart = data.startDate ? new Date(data.startDate + 'T00:00:00') : new Date()
    const projectEnd = data.endDate ? new Date(data.endDate + 'T00:00:00') : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

    // Add regular tasks
    data.tasks.forEach(task => {
      expandedTasks.push({
        id: task.id,
        name: task.name,
        start: new Date(task.start + 'T00:00:00'),
        end: new Date(task.end + 'T00:00:00'),
        progress: task.progress || 0
      })
    })

    // Clear previous chart
    d3.select(ganttRef.current).selectAll('*').remove()

    // Create grid dates based on resolution
    const gridDates = []
    let currentDate = new Date(projectStart)
    while (currentDate <= projectEnd) {
      gridDates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + resolution)
    }

    const margin = { top: 20, right: 20, bottom: 30, left: 200 }
    const columnWidth = 40
    const width = gridDates.length * columnWidth
    const height = expandedTasks.length * 40 + margin.top + margin.bottom

    // Create time scale using original project dates for proper positioning
    const timeScale = d3.scaleTime()
      .domain([projectStart, projectEnd])
      .range([0, width])

    const svg = d3.select(ganttRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Grid lines
    g.selectAll('.grid-line')
      .data(gridDates)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', d => timeScale(d))
      .attr('x2', d => timeScale(d))
      .attr('y1', 0)
      .attr('y2', expandedTasks.length * 40)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)

    // Task bars
    const taskGroups = g.selectAll('.task')
      .data(expandedTasks)
      .enter()
      .append('g')
      .attr('class', 'task')
      .attr('transform', (d, i) => `translate(0,${i * 40})`)

    // Task background bars
    taskGroups.append('rect')
      .attr('x', d => timeScale(d.start))
      .attr('y', 5)
      .attr('width', d => timeScale(d.end) - timeScale(d.start))
      .attr('height', 30)
      .attr('fill', '#e5e7eb')
      .attr('rx', 3)

    // Progress bars
    taskGroups.append('rect')
      .attr('x', d => timeScale(d.start))
      .attr('y', 5)
      .attr('width', d => (timeScale(d.end) - timeScale(d.start)) * (d.progress / 100))
      .attr('height', 30)
      .attr('fill', '#3b82f6')
      .attr('rx', 3)

    // Progress text
    taskGroups.append('text')
      .attr('x', d => timeScale(d.start) + (timeScale(d.end) - timeScale(d.start)) / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(d => `${d.progress}%`)

    // Hover tooltips
    taskGroups.selectAll('rect')
      .on('mouseover', function(event, d: any) {
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .html(`
            <strong>${d.name}</strong><br/>
            Start: ${d.start.toLocaleDateString()}<br/>
            End: ${d.end.toLocaleDateString()}<br/>
            Progress: ${d.progress}%
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function() {
        d3.selectAll('.tooltip').remove()
      })

    // Task labels
    taskGroups.append('text')
      .attr('x', -10)
      .attr('y', 25)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', '#374151')
      .text(d => d.name)

    // Date axis
    const xAxis = d3.axisBottom(timeScale)
      .tickValues(gridDates)
      .tickFormat((d) => d3.timeFormat('%m/%d')(d as Date))

    g.append('g')
      .attr('transform', `translate(0,${expandedTasks.length * 40})`)
      .call(xAxis as any)
  }, [data, resolution])



  useEffect(() => {
    if (data.tasks.length > 0) {
      renderChart()
    }
  }, [data, resolution, renderChart])

  const handleDownload = () => {
    if (!ganttRef.current) return

    const svg = ganttRef.current.querySelector('svg')
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data.title} - Gantt Chart`,
        text: 'Check out this Gantt chart'
      })
    }
  }

  return (
    <ChartTemplate
      title="Gantt Chart Generator"
      description="Create interactive project timelines with tasks, dependencies, and recurring events"
      data={data}
      onDataChange={setData}
      onDownload={handleDownload}
      onShare={handleShare}
      exampleJson={exampleJson}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Resolution (days per column)</label>
        <Select value={resolution.toString()} onValueChange={(value) => setResolution(Number(value))}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 day</SelectItem>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="28">28 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div ref={ganttRef} className="gantt-container min-h-[400px]"></div>
    </ChartTemplate>
  )
}