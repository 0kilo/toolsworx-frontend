import * as XLSX from 'xlsx-color'

interface Task {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  duration: number
  color?: string
}

export const createProfessionalGanttExcel = (
  tasks: Task[],
  projectName: string,
  projectStart: Date,
  projectEnd: Date,
  resolution: number = 1
) => {
  console.log('Starting Excel export with tasks:', tasks.map(t => ({ name: t.name, color: t.color })))
  // Create timeline headers (daily intervals)
  const headers = ['Task ID', 'Task Name', 'Start Date', 'End Date', 'Progress %', 'Duration (Days)']
  const timelineHeaders: string[] = []
  
  let currentDate = new Date(projectStart)
  while (currentDate <= projectEnd) {
    timelineHeaders.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + resolution)
  }
  
  headers.push(...timelineHeaders)

  // Create data rows with visual bars
  const data: (string | number)[][] = [headers]
  tasks.forEach((task, taskIndex) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    
    const row: (string | number)[] = [
      task.id,
      task.name,
      task.startDate,
      task.endDate,
      task.progress,
      task.duration
    ]
    
    // Add timeline bars (empty cells for styling)
    timelineHeaders.forEach(dateStr => {
      const colDate = new Date(dateStr)
      
      if (taskStart <= colDate && taskEnd >= colDate) {
        row.push('')
      } else {
        row.push('')
      }
    })
    
    data.push(row)
  })

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(data)

  // Add cell styling with xlsx-color
  tasks.forEach((task, taskIndex) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    const rowIndex = taskIndex + 1 // +1 for header row
    
    // Find start and end columns for this task
    let startCol = -1
    let endCol = -1
    
    timelineHeaders.forEach((dateStr, colIndex) => {
      const colDate = new Date(dateStr)
      const colEndDate = new Date(colDate)
      colEndDate.setDate(colEndDate.getDate() + resolution - 1)
      const timelineColIndex = 6 + colIndex // 6 fixed columns before timeline
      
      if (taskStart <= colEndDate && taskEnd >= colDate) {
        if (startCol === -1) startCol = timelineColIndex
        endCol = timelineColIndex
      }
    })
    
    // Apply styling to the task span
    if (startCol !== -1 && endCol !== -1) {
      const totalCols = endCol - startCol + 1
      const progressCols = Math.ceil(totalCols * (task.progress / 100))
      
      for (let col = startCol; col <= endCol; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col })
        if (!worksheet[cellRef]) worksheet[cellRef] = { v: '', t: 's' }
        
        const isProgressCell = col < startCol + progressCols
        
        const taskColor = task.color?.replace('#', '') || '3B82F6'
        
        worksheet[cellRef].s = {
          fill: isProgressCell ? { 
            patternType: 'solid',
            fgColor: { rgb: taskColor }
          } : undefined,
          border: {
            top: { style: 'thin', color: { rgb: taskColor } },
            bottom: { style: 'thin', color: { rgb: taskColor } },
            left: col === startCol ? { style: 'medium', color: { rgb: taskColor } } : undefined,
            right: col === endCol ? { style: 'medium', color: { rgb: taskColor } } : undefined
          }
        }
      }
    }
  })

  // Set column widths for better layout
  worksheet['!cols'] = [
    { wch: 10 },  // Task ID
    { wch: 30 },  // Task Name
    { wch: 12 },  // Start Date
    { wch: 12 },  // End Date
    { wch: 10 },  // Progress
    { wch: 12 },  // Duration
    ...timelineHeaders.map(() => ({ wch: 3 })) // Timeline columns
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Gantt Chart')
  XLSX.writeFile(workbook, `${projectName}_gantt.xlsx`)
}