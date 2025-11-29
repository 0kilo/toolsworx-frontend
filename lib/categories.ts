import { Ruler, Calculator, FileText, Film, Code2, Sliders, Heart, BarChart3, LucideIcon } from "lucide-react"

export interface CategoryGroup {
  id: string
  title: string
  description: string
  longDescription: string
  icon: LucideIcon
  color: string
  textColor: string
  iconColor: string
  categories: string[]
  seoKeywords: string[]
  benefits: string[]
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "helpful-calculators",
    title: "Helpful Calculators",
    description: "Practical calculators for everyday tasks",
    longDescription:
      "Our helpful calculators make everyday tasks easier. Scale recipes for different serving sizes, organize secret santa gift exchanges, and count down to important holidays and events. These practical tools save time and help you plan better.",
    icon: Heart,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["helpful"],
    seoKeywords: [
      "recipe scaler",
      "secret santa generator",
      "holiday countdown",
      "recipe calculator",
      "gift exchange",
      "countdown timer",
      "helpful tools",
      "everyday calculators",
    ],
    benefits: [
      "Perfect for everyday tasks",
      "Easy to use interface",
      "Instant results",
      "Free and no registration required",
    ],
  },
  {
    id: "unit-conversions",
    title: "Unit Conversions",
    description: "Convert between different units of measurement",
    longDescription:
      "Our unit conversion tools make it easy to convert between different units of measurement. Whether you need to convert temperature, distance, weight, volume, time, or other units, our calculators provide accurate results instantly. Perfect for students, professionals, travelers, and anyone who needs quick unit conversions.",
    icon: Ruler,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["temperature", "distance", "weight", "volume", "time", "currency"],
    seoKeywords: [
      "unit converter",
      "measurement converter",
      "convert units",
      "temperature conversion",
      "distance conversion",
      "weight conversion",
      "volume conversion",
      "metric conversion",
      "imperial conversion",
    ],
    benefits: [
      "Instant and accurate conversions",
      "Support for metric and imperial units",
      "No installation or registration required",
      "Perfect for students and professionals",
    ],
  },
  {
    id: "calculators",
    title: "Calculators",
    description: "Calculate values for various purposes",
    longDescription:
      "Our online calculators help you quickly calculate important values for everyday tasks and professional use. From financial calculations like mortgage and loan payments to health metrics like BMI and calorie needs, our calculators provide instant, accurate results. All calculators are free to use and work on any device.",
    icon: Calculator,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["calculator"],
    seoKeywords: [
      "online calculator",
      "free calculator",
      "mortgage calculator",
      "bmi calculator",
      "loan calculator",
      "percentage calculator",
      "tip calculator",
      "age calculator",
    ],
    benefits: [
      "Easy-to-use interface",
      "Accurate calculations every time",
      "Works on mobile and desktop",
      "Completely free, no limits",
    ],
  },
  {
    id: "file-converters",
    title: "File Converters",
    description: "Convert documents and files between formats",
    longDescription:
      "Convert your files between different formats with our easy-to-use file conversion tools. Transform PDFs to Word documents, Excel spreadsheets to CSV, and more. Our converters maintain formatting and quality while ensuring your privacy – all files are automatically deleted after conversion.",
    icon: FileText,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["document", "spreadsheet", "data", "encoding", "archive"],
    seoKeywords: [
      "pdf to word",
      "word to pdf",
      "excel to csv",
      "file converter",
      "document converter",
      "convert pdf",
      "convert docx",
      "convert xlsx",
    ],
    benefits: [
      "Fast and secure conversions",
      "Maintains formatting and quality",
      "Files automatically deleted after 1 hour",
      "No file size limits on most conversions",
    ],
  },
  {
    id: "media-converters",
    title: "Media Converters",
    description: "Convert images, videos, and audio files",
    longDescription:
      "Transform your media files with our powerful conversion tools. Convert images between formats like JPG, PNG, and WebP. Transform videos between MP4, WebM, and other formats. Convert audio files to different formats with customizable quality settings. All conversions are processed securely with automatic file deletion.",
    icon: Film,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["image", "video", "audio"],
    seoKeywords: [
      "image converter",
      "video converter",
      "audio converter",
      "jpg to png",
      "mp4 converter",
      "convert video",
      "convert image",
      "convert audio",
      "resize image",
    ],
    benefits: [
      "High-quality conversions",
      "Customizable quality settings",
      "Batch processing available",
      "Privacy-focused with auto-deletion",
    ],
  },
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "Tools for developers, JSON formatters, and utilities",
    longDescription:
      "Essential tools for developers and technical professionals. Format and validate JSON, minify code, generate UUIDs, encode/decode Base64, test regular expressions, and more. All tools work directly in your browser with no server uploads, ensuring your code and data remain private.",
    icon: Code2,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["developer", "formatter", "validator"],
    seoKeywords: [
      "json formatter",
      "json validator",
      "base64 encode",
      "base64 decode",
      "uuid generator",
      "regex tester",
      "code minifier",
      "developer tools",
      "online developer tools",
    ],
    benefits: [
      "Works 100% in your browser",
      "No data sent to servers",
      "Instant results",
      "Perfect for developers and DevOps",
    ],
  },
  {
    id: "filters",
    title: "Filters & Effects",
    description: "Apply filters and effects to images, audio, and data",
    longDescription:
      "Transform your media and data with powerful filters and effects. Apply professional photo filters like grayscale, sepia, and Instagram-style effects. Enhance audio with equalizers, reverb, and noise reduction. Clean and format data with our text processing tools. All processing happens instantly in real-time.",
    icon: Sliders,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["image-filter", "audio-filter", "data-filter"],
    seoKeywords: [
      "image filters",
      "photo effects",
      "instagram filters",
      "audio effects",
      "equalizer",
      "reverb",
      "data formatter",
      "json formatter",
      "apply filter",
    ],
    benefits: [
      "Real-time filter preview",
      "Professional-quality effects",
      "No upload required for many filters",
      "Batch processing available",
    ],
  },
  {
    id: "charts",
    title: "Charts",
    description: "Create interactive charts and visualizations",
    longDescription:
      "Create beautiful, interactive charts and visualizations with our D3.js-powered tools. Build Gantt charts for project management, generate charts from JSON data, or use our property builder to create custom visualizations. All charts can be shared and exported for presentations and reports.",
    icon: BarChart3,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["chart"],
    seoKeywords: [
      "gantt chart",
      "chart generator",
      "data visualization",
      "interactive charts",
      "d3 charts",
      "project timeline",
      "chart builder",
      "json to chart",
    ],
    benefits: [
      "Interactive D3.js visualizations",
      "JSON data import support",
      "Visual property builder",
      "Shareable chart links",
    ],
  },
]

/**
 * Get category group by ID
 */
export function getCategoryGroupById(id: string): CategoryGroup | undefined {
  return categoryGroups.find((group) => group.id === id)
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return categoryGroups.map((group) => group.id)
}
