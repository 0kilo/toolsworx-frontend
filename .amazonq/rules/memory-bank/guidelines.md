# TOOLS WORX - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing required** - All functions must have explicit return types
- **Interface definitions** - Use interfaces for all data structures and props
- **Generic types** - Leverage generics for reusable components and functions
- **Type guards** - Implement proper type validation for external data

```typescript
// ✅ Good: Explicit interface and return type
interface ConversionRequest {
  inputPath: string
  targetFormat: string
  options: Record<string, any>
  onProgress?: (progress: number) => Promise<void>
}

async function process(request: ConversionRequest): Promise<ConversionResult> {
  // Implementation
}
```

### Error Handling Patterns
- **Try-catch blocks** - Wrap all async operations and external calls
- **Cleanup on error** - Always clean up temporary resources in catch blocks
- **Descriptive error messages** - Include context and actionable information
- **Error propagation** - Re-throw errors with additional context when needed

```typescript
// ✅ Standard error handling pattern
try {
  if (onProgress) await onProgress(20)
  await this.executeLibreOffice(inputPath, outputDir, targetFormat)
  if (onProgress) await onProgress(80)
} catch (error) {
  await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
  throw error
}
```

### File and Resource Management
- **Temporary directories** - Use `fs.mkdtemp()` for isolated temporary workspaces
- **Automatic cleanup** - Always clean up temporary files, even on errors
- **Resource disposal** - Properly close streams, processes, and file handles
- **Path handling** - Use `path.join()` for cross-platform compatibility

```typescript
// ✅ Proper resource management
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'doc-convert-'))
try {
  // Work with files
} finally {
  await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
}
```

## React Component Patterns

### Component Structure
- **"use client" directive** - Required for all interactive components
- **Props interface first** - Define interfaces before component implementation
- **Hooks at top** - All React hooks declared before other logic
- **Event handlers grouped** - Keep related handlers together

```typescript
// ✅ Standard component structure
"use client"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function FileDropzone({ onFileSelect, accept = "image/*" }: FileDropzoneProps) {
  // All hooks first
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Event handlers grouped
  const handleDrag = useCallback((e: React.DragEvent) => {
    // Implementation
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    // Implementation
  }, [onFileSelect, maxSize])
}
```

### State Management
- **useState for local state** - Component-level state management
- **useCallback for handlers** - Memoize event handlers with proper dependencies
- **Dependency arrays** - Always include all dependencies in useCallback/useEffect
- **State updates** - Use functional updates for complex state changes

```typescript
// ✅ Proper state and callback patterns
const [functions, setFunctions] = useState<FunctionData[]>([
  { id: "1", expression: "sin(x)", color: COLORS[0], visible: true },
])

const toggleFunction = useCallback((id: string) => {
  setFunctions(prev => 
    prev.map(f => f.id === id ? { ...f, visible: !f.visible } : f)
  )
}, [])
```

### Event Handling
- **Prevent defaults** - Always prevent default behavior for drag/drop events
- **Event delegation** - Use event delegation for dynamic content
- **Cleanup listeners** - Remove event listeners in useEffect cleanup
- **Touch support** - Include touch events for mobile compatibility

```typescript
// ✅ Complete event handling with cleanup
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    // Handle zoom
  }

  canvas.addEventListener('wheel', handleWheel, { passive: false })
  return () => canvas.removeEventListener('wheel', handleWheel)
}, [viewport])
```

## UI/UX Patterns

### Component Composition
- **shadcn/ui base components** - Use provided UI primitives as foundation
- **Compound components** - Build complex UI from simple, reusable parts
- **Conditional rendering** - Use ternary operators for simple conditions
- **Fragment usage** - Avoid unnecessary wrapper divs

```typescript
// ✅ Clean component composition
return (
  <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "container py-8"}>
    {!isFullscreen && (
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Graphing Calculator</h1>
      </div>
    )}
  </div>
)
```

### Styling Conventions
- **Tailwind CSS classes** - Use utility classes for all styling
- **Conditional classes** - Use `cn()` utility for conditional styling
- **Responsive design** - Include mobile-first responsive classes
- **Theme consistency** - Reference theme configuration for colors and spacing

```typescript
// ✅ Proper styling patterns
className={cn(
  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
  isDragging
    ? "border-primary bg-primary/5"
    : "border-muted-foreground/25 hover:border-primary/50"
)}
```

### Accessibility
- **Semantic HTML** - Use appropriate HTML elements for content structure
- **ARIA labels** - Include aria-label for icon-only buttons
- **Keyboard navigation** - Support Enter key for form submissions
- **Focus management** - Proper focus states and tab order

```typescript
// ✅ Accessible form handling
<Input
  id="expression"
  placeholder="e.g., x^2, sin(x)"
  value={newExpression}
  onChange={(e) => setNewExpression(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && addFunction()}
/>
```

## API and Service Patterns

### Service Architecture
- **Class-based processors** - Use classes for stateful processing logic
- **Interface contracts** - Define clear interfaces for all service methods
- **Progress callbacks** - Support progress reporting for long operations
- **Result objects** - Return structured result objects with metadata

```typescript
// ✅ Service interface pattern
export interface ConversionRequest {
  inputPath: string
  targetFormat: string
  options: Record<string, any>
  onProgress?: (progress: number) => Promise<void>
}

export class FileConversionProcessor {
  async process(request: ConversionRequest): Promise<ConversionResult> {
    // Implementation with progress reporting
  }
}
```

### Process Management
- **Child process spawning** - Use spawn() for external tool integration
- **Timeout handling** - Set reasonable timeouts for all external processes
- **Stream handling** - Capture stderr for error reporting
- **Promise wrapping** - Wrap child processes in promises for async/await

```typescript
// ✅ Process management pattern
return new Promise((resolve, reject) => {
  const process = spawn(config.libreOfficePath, args, {
    timeout: 300000, // 5 minutes
    stdio: 'pipe',
  })

  let stderr = ''
  process.stderr?.on('data', (data) => {
    stderr += data.toString()
  })

  process.on('close', (code) => {
    if (code === 0) resolve()
    else reject(new Error(`Process exited with code ${code}: ${stderr}`))
  })
})
```

### Data Validation
- **Input validation** - Validate all inputs at service boundaries
- **File type checking** - Verify file extensions and MIME types
- **Size limits** - Enforce file size restrictions
- **Format support** - Check format compatibility before processing

```typescript
// ✅ Validation patterns
const validateFile = (file: File): string | null => {
  const maxSizeBytes = maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `File size exceeds ${maxSize}MB limit`
  }
  return null
}

private isDocumentConversion(from: string, to: string): boolean {
  const docFormats = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html']
  return docFormats.includes(from) && docFormats.includes(to)
}
```

## Configuration and Constants

### Configuration Management
- **Centralized config** - Single configuration file per service
- **Environment variables** - Use env vars for deployment-specific settings
- **Type-safe config** - Define interfaces for configuration objects
- **Default values** - Provide sensible defaults for optional settings

```typescript
// ✅ Configuration pattern
export const config = {
  libreOfficePath: process.env.LIBREOFFICE_PATH || '/usr/bin/libreoffice',
  tempDir: process.env.TEMP_DIR || os.tmpdir(),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '100') * 1024 * 1024,
}
```

### Constants and Enums
- **Uppercase constants** - Use UPPER_CASE for constant values
- **Grouped constants** - Group related constants in objects
- **Type definitions** - Use const assertions for type safety
- **Lookup tables** - Use objects for mapping relationships

```typescript
// ✅ Constants pattern
const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

const LENGTH_TO_METERS: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  ft: 0.3048,
}
```

## Performance Optimization

### Canvas and Graphics
- **RequestAnimationFrame** - Use for smooth animations
- **Canvas optimization** - Clear and redraw efficiently
- **Event throttling** - Throttle high-frequency events like mouse/touch
- **Memory management** - Clean up canvas contexts and event listeners

### File Processing
- **Streaming** - Use streams for large file operations
- **Chunked processing** - Process large datasets in chunks
- **Memory limits** - Monitor and limit memory usage
- **Parallel processing** - Use worker threads for CPU-intensive tasks

### Caching Strategies
- **Result caching** - Cache conversion results when appropriate
- **Memoization** - Memoize expensive calculations
- **Asset optimization** - Optimize images and static assets
- **CDN usage** - Leverage CDN for static content delivery