import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'File Conversion Cheat Sheet - Format Guide & Best Practices',
  description: 'Complete guide to file formats, conversion methods, and best practices for documents, spreadsheets, and data files.',
  keywords: [
    'file conversion guide',
    'file formats',
    'document conversion',
    'pdf conversion',
    'excel conversion',
    'data formats'
  ],
  canonical: 'https://toolsworx.com/file-converters-cheatsheet',
})

const cheatSheetContent = `
# File Conversion Quick Reference

## Document Formats

### PDF (Portable Document Format)
- **Best for:** Final documents, printing, sharing
- **Pros:** Universal compatibility, preserves formatting
- **Cons:** Difficult to edit
- **Common conversions:** PDF ↔ Word, PDF ↔ Excel, PDF ↔ PowerPoint

### Microsoft Word (.docx, .doc)
- **Best for:** Text documents, collaborative editing
- **Pros:** Rich formatting, widely supported
- **Cons:** Version compatibility issues
- **Common conversions:** Word ↔ PDF, Word ↔ HTML, Word ↔ RTF

### Rich Text Format (.rtf)
- **Best for:** Cross-platform document sharing
- **Pros:** Universal compatibility, preserves basic formatting
- **Cons:** Limited formatting options

## Spreadsheet Formats

### Microsoft Excel (.xlsx, .xls)
- **Best for:** Complex calculations, data analysis
- **Pros:** Advanced formulas, charts, macros
- **Cons:** Proprietary format
- **Common conversions:** Excel ↔ CSV, Excel ↔ PDF

### CSV (Comma-Separated Values)
- **Best for:** Data exchange, database imports
- **Pros:** Universal compatibility, lightweight
- **Cons:** No formatting, formulas lost
- **Structure:** Name,Age,City

### OpenDocument Spreadsheet (.ods)
- **Best for:** Open-source alternative to Excel
- **Pros:** Open standard, free
- **Cons:** Limited compatibility

## Data Formats

### JSON (JavaScript Object Notation)
\`\`\`json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
\`\`\`
- **Best for:** Web APIs, configuration files
- **Pros:** Human-readable, lightweight
- **Cons:** No comments, limited data types

### XML (eXtensible Markup Language)
\`\`\`xml
<person>
  <name>John Doe</name>
  <age>30</age>
  <city>New York</city>
</person>
\`\`\`
- **Best for:** Structured data, configuration
- **Pros:** Self-describing, supports validation
- **Cons:** Verbose, complex parsing

### YAML (YAML Ain't Markup Language)
\`\`\`yaml
name: John Doe
age: 30
city: New York
\`\`\`
- **Best for:** Configuration files, documentation
- **Pros:** Human-readable, supports comments
- **Cons:** Indentation-sensitive

## Archive Formats

### ZIP
- **Best for:** File compression, bundling
- **Compression:** Good balance of speed and size
- **Compatibility:** Universal support

### RAR
- **Best for:** Maximum compression
- **Compression:** Better than ZIP
- **Compatibility:** Requires special software

### 7Z
- **Best for:** Best compression ratio
- **Compression:** Excellent
- **Compatibility:** Open source

## Conversion Best Practices

### Before Converting
1. **Backup original files**
2. **Check file size limits**
3. **Verify format compatibility**
4. **Consider quality loss**

### Quality Preservation
- **Documents:** Use native formats when possible
- **Images:** Avoid multiple conversions
- **Data:** Validate after conversion
- **Archives:** Test extraction before sharing

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Formatting lost | Use compatible formats (RTF, HTML) |
| File too large | Compress or split files |
| Encoding errors | Specify UTF-8 encoding |
| Formula errors | Export as values, not formulas |
| Font issues | Embed fonts or use standard fonts |

## File Size Guidelines

### Document Optimization
- **PDF:** Use compression, optimize images
- **Word:** Remove unused styles, compress images
- **Excel:** Remove empty rows/columns, compress

### When to Convert
- **PDF → Word:** Need to edit content
- **Excel → CSV:** Database import, data analysis
- **Word → PDF:** Final distribution, printing
- **JSON → XML:** Legacy system compatibility

## Security Considerations

### Safe Conversion Practices
1. **Scan files for malware**
2. **Remove sensitive metadata**
3. **Use trusted conversion tools**
4. **Verify file integrity**

### Metadata Removal
- **PDF:** Remove author, creation date
- **Word:** Clear document properties
- **Excel:** Remove personal information
- **Images:** Strip EXIF data

*Note: Detailed conversion procedures and advanced techniques will be added soon.*
`

export default function FileConvertersCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="File Conversion Cheat Sheet"
            description="Essential guide to file formats and conversion best practices"
            content={cheatSheetContent}
            category="file-converters"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}