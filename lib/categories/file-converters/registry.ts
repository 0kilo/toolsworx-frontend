import { ConverterMetadata } from "@/types/converter"

/**
 * File Converters Registry
 * All file/document conversion tools from FILE_CONVERSION_SERVICE_SPEC.md
 */
export const fileConverterTools: ConverterMetadata[] = [
  // Backend-dependent tools temporarily disabled while Cloud Run backend is offline.
  // Uncomment entries below to re-enable file converters.
  // {
  //   id: "document-converter",
  //   title: "Document Converter",
  //   description: "Convert between PDF, Word, Text, and other document formats",
  //   category: "document",
  //   icon: FileText,
  //   href: "/file-converters/documents",
  //   keywords: ["pdf", "word", "docx", "text", "html", "document"],
  //   popular: true,
  // },
  // {
  //   id: "spreadsheet-converter",
  //   title: "Spreadsheet Converter",
  //   description: "Convert between Excel, CSV, and spreadsheet formats",
  //   category: "spreadsheet",
  //   icon: FileSpreadsheet,
  //   href: "/file-converters/spreadsheet",
  //   keywords: ["excel", "csv", "xlsx", "spreadsheet", "data"],
  //   popular: true,
  // },
  // {
  //   id: "data-converter",
  //   title: "Data Format Converter",
  //   description: "Convert between JSON, XML, YAML, and CSV data formats",
  //   category: "data",
  //   icon: FileJson,
  //   href: "/file-converters/data",
  //   keywords: ["json", "xml", "yaml", "csv", "data", "api"],
  //   popular: true,
  // },
  // {
  //   id: "base64-converter",
  //   title: "Base64 Encoder/Decoder",
  //   description: "Encode files to Base64 or decode Base64 to files",
  //   category: "encoding",
  //   icon: Code,
  //   href: "/file-converters/base64",
  //   keywords: ["base64", "encode", "decode", "encoding"],
  //   popular: true,
  // },
  // {
  //   id: "archive-tools",
  //   title: "Archive Tools",
  //   description: "Create ZIP archives or extract files from archives",
  //   category: "archive",
  //   icon: Archive,
  //   href: "/file-converters/archive",
  //   keywords: ["zip", "archive", "extract", "compress"],
  //   popular: true,
  // },
]
