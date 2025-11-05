import { Ruler, Calculator, FileText, Film, Code2, LucideIcon } from "lucide-react"

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
    id: "unit-conversions",
    title: "Unit Conversions",
    description: "Convert between different units of measurement",
    longDescription:
      "Our unit conversion tools make it easy to convert between different units of measurement. Whether you need to convert temperature, distance, weight, volume, time, or other units, our calculators provide accurate results instantly. Perfect for students, professionals, travelers, and anyone who needs quick unit conversions.",
    icon: Ruler,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    iconColor: "text-blue-600",
    categories: ["temperature", "distance", "weight", "volume", "time"],
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
    color: "bg-green-50 border-green-200",
    textColor: "text-green-900",
    iconColor: "text-green-600",
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
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-900",
    iconColor: "text-purple-600",
    categories: ["document"],
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
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-900",
    iconColor: "text-orange-600",
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
    color: "bg-slate-50 border-slate-200",
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
