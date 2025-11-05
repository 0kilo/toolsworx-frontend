import { FileText } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * File Converters Registry
 * All file/document conversion tools are registered here
 */
export const fileConverterTools: ConverterMetadata[] = [
  // Document Conversions
  {
    id: "pdf-word",
    title: "PDF to Word",
    description: "Convert PDF documents to Word format",
    category: "document",
    icon: FileText,
    href: "/file-converters/pdf-word",
    keywords: ["pdf", "word", "docx", "document"],
    popular: true,
  },
  // Future file converters will be added here
]
