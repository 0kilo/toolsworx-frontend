import { Metadata } from "next"
import { CheatSheet } from "@/components/shared/cheat-sheet"

export const metadata: Metadata = {
  title: "Charts Cheat Sheet - Quick Reference Guide | Tools Worx",
  description: "Complete reference guide for creating charts and visualizations. JSON structure examples, D3.js tips, and chart building best practices.",
  keywords: ["charts cheat sheet", "gantt chart guide", "json structure", "d3 charts", "visualization guide"],
}

export default function ChartsCheatSheetPage() {
  const content = `# Gantt Chart JSON Structure

## Basic Structure
\`\`\`json
{
  "title": "Project Name",
  "tasks": [
    {
      "id": "unique-id",
      "name": "Task Name", 
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD",
      "progress": 0-100
    }
  ]
}
\`\`\`

## Task Dependencies
\`\`\`json
"dependencies": ["task1", "task2"]
\`\`\`

## Date Format
Use ISO format: YYYY-MM-DD (e.g., 2024-01-15)

## Progress Values
Integer from 0 to 100 representing completion percentage

# Chart Features

| Feature | Description |
|---------|-------------|
| Interactive Timeline | D3.js powered interactive timeline with zoom and pan capabilities |
| Progress Tracking | Visual progress bars showing task completion status |
| Export Options | Download charts as SVG files for presentations |
| Share Functionality | Share charts via email, social media, or direct links |

# Property Builder

| Feature | Description |
|---------|-------------|
| Visual Editor | Build charts without writing JSON using form inputs |
| Add/Remove Tasks | Dynamically add or remove tasks from your timeline |
| Date Picker | Visual date selection for task start and end dates |
| Real-time Preview | See chart updates instantly as you modify properties |

# Best Practices

- **Task Naming**: Use clear, descriptive names for better readability
- **Date Planning**: Ensure end dates are after start dates
- **Progress Updates**: Keep progress values realistic and up-to-date
- **Chart Title**: Use descriptive titles that explain the project scope`

  return (
    <CheatSheet
      title="Charts & Visualizations"
      description="Quick reference for creating interactive charts and data visualizations"
      content={content}
      category="charts"
    />
  )
}