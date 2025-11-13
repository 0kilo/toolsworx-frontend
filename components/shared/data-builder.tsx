"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Task {
  id: string
  name: string
  start: string
  end: string
  progress?: number
  dependencies?: string[]
}

interface GanttData {
  title: string
  startDate?: string
  endDate?: string
  tasks: Task[]
  recurrences?: any[]
}

interface DataBuilderProps {
  onDataChange: (data: GanttData) => void
  initialData?: GanttData
}

export function DataBuilder({ onDataChange, initialData }: DataBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || "Project Timeline")
  const [startDate, setStartDate] = useState(initialData?.startDate || "2024-01-01")
  const [endDate, setEndDate] = useState(initialData?.endDate || "2024-04-30")
  const [tasks, setTasks] = useState<Task[]>(initialData?.tasks || [
    { id: "task1", name: "Task 1", start: "2024-01-01", end: "2024-01-15", progress: 0 }
  ])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "Project Timeline")
      setStartDate(initialData.startDate || "2024-01-01")
      setEndDate(initialData.endDate || "2024-04-30")
      setTasks(initialData.tasks || [])
    }
  }, [initialData])

  const addTask = () => {
    const newTask: Task = {
      id: `task${tasks.length + 1}`,
      name: `Task ${tasks.length + 1}`,
      start: startDate,
      end: endDate,
      progress: 0
    }
    const newTasks = [...tasks, newTask]
    setTasks(newTasks)
    updateData(title, startDate, endDate, newTasks)
  }

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)
    updateData(title, startDate, endDate, newTasks)
  }

  const updateTask = (index: number, field: keyof Task, value: string | number) => {
    const newTasks = tasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    )
    setTasks(newTasks)
    updateData(title, startDate, endDate, newTasks)
  }

  const updateData = (newTitle: string, newStartDate: string, newEndDate: string, newTasks: Task[]) => {
    onDataChange({
      title: newTitle,
      startDate: newStartDate,
      endDate: newEndDate,
      tasks: newTasks
    })
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    updateData(value, startDate, endDate, tasks)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    updateData(title, value, endDate, tasks)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    updateData(title, startDate, value, tasks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Project Title</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Project Timeline"
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Tasks</Label>
            <Button onClick={addTask} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          
          {tasks.map((task, index) => (
            <div key={task.id} className="grid grid-cols-12 gap-2 items-center p-2 border rounded">
              <div className="col-span-3">
                <Input
                  value={task.name}
                  onChange={(e) => updateTask(index, 'name', e.target.value)}
                  placeholder="Task name"
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="date"
                  value={task.start}
                  onChange={(e) => updateTask(index, 'start', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="date"
                  value={task.end}
                  onChange={(e) => updateTask(index, 'end', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => updateTask(index, 'progress', parseInt(e.target.value) || 0)}
                  placeholder="Progress %"
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={task.id}
                  onChange={(e) => updateTask(index, 'id', e.target.value)}
                  placeholder="Task ID"
                  className="text-sm"
                />
              </div>
              <div className="col-span-1">
                <Button
                  onClick={() => removeTask(index)}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}