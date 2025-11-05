# MCP Server Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing an MCP (Model Context Protocol) server that exposes our conversion tools and calculators to AI agents.

---

## 🏗️ Architecture

### Project Structure

```
convert-all/
├── mcp-server/                    # New directory for MCP server
│   ├── src/
│   │   ├── index.ts              # Main server entry point
│   │   ├── tools/                # Tool implementations
│   │   │   ├── converters/       # Unit converters
│   │   │   │   ├── length.ts
│   │   │   │   ├── weight.ts
│   │   │   │   ├── temperature.ts
│   │   │   │   └── index.ts
│   │   │   ├── calculators/      # Calculator tools
│   │   │   │   ├── bmi.ts
│   │   │   │   ├── mortgage.ts
│   │   │   │   ├── scientific.ts
│   │   │   │   └── index.ts
│   │   │   └── registry.ts       # Tool registry
│   │   ├── schemas/              # JSON schemas for tools
│   │   │   └── tools.ts
│   │   └── utils/                # Utilities
│   │       ├── validation.ts
│   │       └── errors.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── lib/                          # Existing logic (reuse!)
│   └── categories/
│       ├── converters/logic.ts
│       └── calculators/logic.ts
└── ... (rest of Next.js app)
```

---

## 📦 Installation & Setup

### Step 1: Install MCP SDK

```bash
cd convert-all
mkdir mcp-server
cd mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node ts-node
```

### Step 2: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Update package.json

```json
{
  "name": "convert-all-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for conversion tools and calculators",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "tsc --watch"
  },
  "keywords": ["mcp", "converter", "calculator"],
  "author": "Your Name",
  "license": "MIT"
}
```

---

## 🔧 Implementation

### Step 4: Create Main Server (`src/index.ts`)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js"
import { toolRegistry } from "./tools/registry.js"

class ConversionMCPServer {
  private server: Server

  constructor() {
    this.server = new Server(
      {
        name: "convert-all-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.setupHandlers()
    this.setupErrorHandling()
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: toolRegistry.getAllTools(),
      }
    })

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        const tool = toolRegistry.getTool(name)
        if (!tool) {
          throw new Error(`Unknown tool: ${name}`)
        }

        const result = await tool.execute(args)

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          isError: true,
        }
      }
    })
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error)
    }

    process.on("SIGINT", async () => {
      await this.server.close()
      process.exit(0)
    })
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error("Convert-All MCP Server running on stdio")
  }
}

// Start server
const server = new ConversionMCPServer()
server.run().catch(console.error)
```

### Step 5: Create Tool Registry (`src/tools/registry.ts`)

```typescript
import { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface MCPTool extends Tool {
  execute: (args: any) => Promise<any>
}

class ToolRegistry {
  private tools: Map<string, MCPTool> = new Map()

  register(tool: MCPTool) {
    this.tools.set(tool.name, tool)
  }

  getTool(name: string): MCPTool | undefined {
    return this.tools.get(name)
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }))
  }
}

export const toolRegistry = new ToolRegistry()

// Import and register all tools
import "./converters/index.js"
import "./calculators/index.js"
```

### Step 6: Implement Length Converter (`src/tools/converters/length.ts`)

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const lengthTool: MCPTool = {
  name: "length-converter",
  description: "Convert between different units of length (meters, feet, inches, kilometers, miles, etc.)",
  inputSchema: {
    type: "object",
    properties: {
      value: {
        type: "number",
        description: "The numeric value to convert",
      },
      fromUnit: {
        type: "string",
        enum: ["m", "km", "cm", "mm", "ft", "in", "mi", "yd"],
        description: "The unit to convert from",
      },
      toUnit: {
        type: "string",
        enum: ["m", "km", "cm", "mm", "ft", "in", "mi", "yd"],
        description: "The unit to convert to",
      },
    },
    required: ["value", "fromUnit", "toUnit"],
  },
  execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
    const { value, fromUnit, toUnit } = args

    // Conversion factors to meters
    const toMeters: Record<string, number> = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      ft: 0.3048,
      in: 0.0254,
      mi: 1609.34,
      yd: 0.9144,
    }

    // Convert to meters first, then to target unit
    const meters = value * toMeters[fromUnit]
    const result = meters / toMeters[toUnit]

    return {
      result: result,
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
      formula: `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`,
    }
  },
}

toolRegistry.register(lengthTool)
```

### Step 7: Implement Weight Converter (`src/tools/converters/weight.ts`)

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const weightTool: MCPTool = {
  name: "weight-converter",
  description: "Convert between different units of weight/mass",
  inputSchema: {
    type: "object",
    properties: {
      value: {
        type: "number",
        description: "The numeric value to convert",
      },
      fromUnit: {
        type: "string",
        enum: ["kg", "g", "mg", "lbs", "oz", "ton", "stone"],
        description: "The unit to convert from",
      },
      toUnit: {
        type: "string",
        enum: ["kg", "g", "mg", "lbs", "oz", "ton", "stone"],
        description: "The unit to convert to",
      },
    },
    required: ["value", "fromUnit", "toUnit"],
  },
  execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
    const { value, fromUnit, toUnit } = args

    // Conversion factors to kilograms
    const toKg: Record<string, number> = {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lbs: 0.453592,
      oz: 0.0283495,
      ton: 1000,
      stone: 6.35029,
    }

    const kg = value * toKg[fromUnit]
    const result = kg / toKg[toUnit]

    return {
      result: result,
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
      formula: `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`,
    }
  },
}

toolRegistry.register(weightTool)
```

### Step 8: Implement Temperature Converter (`src/tools/converters/temperature.ts`)

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const temperatureTool: MCPTool = {
  name: "temperature-converter",
  description: "Convert between Celsius, Fahrenheit, and Kelvin",
  inputSchema: {
    type: "object",
    properties: {
      value: {
        type: "number",
        description: "The temperature value to convert",
      },
      fromUnit: {
        type: "string",
        enum: ["celsius", "fahrenheit", "kelvin"],
        description: "The unit to convert from",
      },
      toUnit: {
        type: "string",
        enum: ["celsius", "fahrenheit", "kelvin"],
        description: "The unit to convert to",
      },
    },
    required: ["value", "fromUnit", "toUnit"],
  },
  execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
    const { value, fromUnit, toUnit } = args

    // Convert to Celsius first
    let celsius: number
    switch (fromUnit) {
      case "celsius":
        celsius = value
        break
      case "fahrenheit":
        celsius = (value - 32) * (5 / 9)
        break
      case "kelvin":
        celsius = value - 273.15
        break
      default:
        throw new Error(`Unknown unit: ${fromUnit}`)
    }

    // Convert from Celsius to target unit
    let result: number
    switch (toUnit) {
      case "celsius":
        result = celsius
        break
      case "fahrenheit":
        result = celsius * (9 / 5) + 32
        break
      case "kelvin":
        result = celsius + 273.15
        break
      default:
        throw new Error(`Unknown unit: ${toUnit}`)
    }

    return {
      result: result,
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
      formula: `${value}° ${fromUnit} = ${result.toFixed(2)}° ${toUnit}`,
    }
  },
}

toolRegistry.register(temperatureTool)
```

### Step 9: Export Converter Tools (`src/tools/converters/index.ts`)

```typescript
// This file imports all converter tools to register them
import "./length.js"
import "./weight.js"
import "./temperature.js"
// Add more converters as they're implemented
```

### Step 10: Implement BMI Calculator (`src/tools/calculators/bmi.ts`)

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const bmiTool: MCPTool = {
  name: "bmi-calculator",
  description: "Calculate Body Mass Index (BMI) from height and weight",
  inputSchema: {
    type: "object",
    properties: {
      weight: {
        type: "number",
        description: "Weight value",
        minimum: 20,
        maximum: 500,
      },
      weightUnit: {
        type: "string",
        enum: ["kg", "lbs"],
        description: "Unit of weight measurement",
      },
      height: {
        type: "number",
        description: "Height value",
        minimum: 50,
        maximum: 300,
      },
      heightUnit: {
        type: "string",
        enum: ["cm", "in"],
        description: "Unit of height measurement",
      },
    },
    required: ["weight", "weightUnit", "height", "heightUnit"],
  },
  execute: async (args: {
    weight: number
    weightUnit: string
    height: number
    heightUnit: string
  }) => {
    let { weight, height } = args
    const { weightUnit, heightUnit } = args

    // Convert to metric
    if (weightUnit === "lbs") {
      weight = weight * 0.453592
    }
    if (heightUnit === "in") {
      height = height * 2.54
    }

    // Calculate BMI
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)

    // Determine category
    let category: string
    let advice: string

    if (bmi < 18.5) {
      category = "Underweight"
      advice = "Consider consulting a healthcare provider for guidance"
    } else if (bmi < 25) {
      category = "Normal weight"
      advice = "Maintain your healthy lifestyle"
    } else if (bmi < 30) {
      category = "Overweight"
      advice = "Consider a balanced diet and regular exercise"
    } else {
      category = "Obese"
      advice = "Consult a healthcare provider for personalized advice"
    }

    // Calculate healthy weight range
    const minHealthyWeight = 18.5 * heightInMeters * heightInMeters
    const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category: category,
      advice: advice,
      healthyWeightRange: {
        min: parseFloat(minHealthyWeight.toFixed(1)),
        max: parseFloat(maxHealthyWeight.toFixed(1)),
        unit: "kg",
      },
      input: {
        weight: args.weight,
        weightUnit: args.weightUnit,
        height: args.height,
        heightUnit: args.heightUnit,
      },
    }
  },
}

toolRegistry.register(bmiTool)
```

### Step 11: Implement Scientific Calculator (`src/tools/calculators/scientific.ts`)

```typescript
import { toolRegistry, MCPTool } from "../registry.js"
import { evaluate } from "mathjs"

const scientificCalculatorTool: MCPTool = {
  name: "scientific-calculator",
  description: "Evaluate mathematical expressions with scientific functions (sin, cos, log, sqrt, etc.)",
  inputSchema: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression to evaluate (e.g., 'sin(30)', 'sqrt(16) + 2^3')",
      },
      angleUnit: {
        type: "string",
        enum: ["degrees", "radians"],
        description: "Unit for trigonometric functions (default: radians)",
        default: "radians",
      },
    },
    required: ["expression"],
  },
  execute: async (args: { expression: string; angleUnit?: string }) => {
    const { expression, angleUnit = "radians" } = args

    try {
      // If using degrees, convert trig functions
      let processedExpression = expression
      if (angleUnit === "degrees") {
        // Convert degrees to radians for mathjs
        processedExpression = expression
          .replace(/sin\(([^)]+)\)/g, "sin(($1) * pi / 180)")
          .replace(/cos\(([^)]+)\)/g, "cos(($1) * pi / 180)")
          .replace(/tan\(([^)]+)\)/g, "tan(($1) * pi / 180)")
      }

      const result = evaluate(processedExpression)

      return {
        result: typeof result === "number" ? result : result.toString(),
        expression: expression,
        angleUnit: angleUnit,
        type: typeof result,
      }
    } catch (error) {
      throw new Error(
        `Failed to evaluate expression: ${error instanceof Error ? error.message : "Invalid expression"}`
      )
    }
  },
}

toolRegistry.register(scientificCalculatorTool)
```

### Step 12: Export Calculator Tools (`src/tools/calculators/index.ts`)

```typescript
// This file imports all calculator tools to register them
import "./bmi.js"
import "./scientific.js"
// Add mortgage, loan, tip, percentage calculators later
```

---

## 🧪 Testing

### Step 13: Create Test File (`src/test.ts`)

```typescript
import { toolRegistry } from "./tools/registry.js"

async function testTools() {
  console.log("=== Testing MCP Tools ===\n")

  // Test Length Converter
  console.log("1. Testing Length Converter")
  const lengthTool = toolRegistry.getTool("length-converter")
  if (lengthTool) {
    const result = await lengthTool.execute({
      value: 5,
      fromUnit: "ft",
      toUnit: "m",
    })
    console.log(result)
  }

  // Test Weight Converter
  console.log("\n2. Testing Weight Converter")
  const weightTool = toolRegistry.getTool("weight-converter")
  if (weightTool) {
    const result = await weightTool.execute({
      value: 150,
      fromUnit: "lbs",
      toUnit: "kg",
    })
    console.log(result)
  }

  // Test Temperature Converter
  console.log("\n3. Testing Temperature Converter")
  const tempTool = toolRegistry.getTool("temperature-converter")
  if (tempTool) {
    const result = await tempTool.execute({
      value: 32,
      fromUnit: "fahrenheit",
      toUnit: "celsius",
    })
    console.log(result)
  }

  // Test BMI Calculator
  console.log("\n4. Testing BMI Calculator")
  const bmiTool = toolRegistry.getTool("bmi-calculator")
  if (bmiTool) {
    const result = await bmiTool.execute({
      weight: 180,
      weightUnit: "lbs",
      height: 70,
      heightUnit: "in",
    })
    console.log(result)
  }

  // Test Scientific Calculator
  console.log("\n5. Testing Scientific Calculator")
  const calcTool = toolRegistry.getTool("scientific-calculator")
  if (calcTool) {
    const result = await calcTool.execute({
      expression: "sqrt(16) + 2^3",
      angleUnit: "radians",
    })
    console.log(result)
  }

  console.log("\n=== All Tests Complete ===")
}

testTools().catch(console.error)
```

### Run Tests

```bash
npm run dev
```

Expected output:
```
=== Testing MCP Tools ===

1. Testing Length Converter
{ result: 1.524, value: 5, fromUnit: 'ft', toUnit: 'm', formula: '5 ft = 1.5240 m' }

2. Testing Weight Converter
{ result: 68.0389, value: 150, fromUnit: 'lbs', toUnit: 'kg', formula: '150 lbs = 68.0389 kg' }

3. Testing Temperature Converter
{ result: 0, value: 32, fromUnit: 'fahrenheit', toUnit: 'celsius', formula: '32° fahrenheit = 0.00° celsius' }

4. Testing BMI Calculator
{
  bmi: 25.8,
  category: 'Overweight',
  advice: 'Consider a balanced diet and regular exercise',
  healthyWeightRange: { min: 58.7, max: 79.0, unit: 'kg' },
  input: { weight: 180, weightUnit: 'lbs', height: 70, heightUnit: 'in' }
}

5. Testing Scientific Calculator
{ result: 12, expression: 'sqrt(16) + 2^3', angleUnit: 'radians', type: 'number' }

=== All Tests Complete ===
```

---

## 🚀 Running the MCP Server

### Method 1: Direct Execution

```bash
npm run build
npm start
```

### Method 2: Using MCP Inspector (Development)

Install MCP Inspector:
```bash
npm install -g @modelcontextprotocol/inspector
```

Run server with inspector:
```bash
mcp-inspector node dist/index.js
```

This opens a web UI at `http://localhost:6274` where you can:
- See all registered tools
- Test tool calls
- View request/response logs
- Debug issues

### Method 3: Integration with Claude Desktop

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "convert-all": {
      "command": "node",
      "args": ["/path/to/convert-all/mcp-server/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. Now Claude can use your tools!

---

## 📊 Adding More Tools

### Template for New Converter Tool

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const yourToolName: MCPTool = {
  name: "your-tool-name",
  description: "Description of what this tool does",
  inputSchema: {
    type: "object",
    properties: {
      // Define parameters
      value: {
        type: "number",
        description: "Description of parameter",
      },
      // ... more parameters
    },
    required: ["value"], // Required parameters
  },
  execute: async (args: { value: number /* ... */ }) => {
    // Implement conversion logic
    const result = args.value * CONVERSION_FACTOR

    return {
      result: result,
      // ... other return values
    }
  },
}

toolRegistry.register(yourToolName)
```

### Example: Volume Converter

```typescript
import { toolRegistry, MCPTool } from "../registry.js"

const volumeTool: MCPTool = {
  name: "volume-converter",
  description: "Convert between different units of volume",
  inputSchema: {
    type: "object",
    properties: {
      value: { type: "number", description: "Volume value to convert" },
      fromUnit: {
        type: "string",
        enum: ["l", "ml", "gal", "cup", "oz", "m3"],
        description: "Unit to convert from",
      },
      toUnit: {
        type: "string",
        enum: ["l", "ml", "gal", "cup", "oz", "m3"],
        description: "Unit to convert to",
      },
    },
    required: ["value", "fromUnit", "toUnit"],
  },
  execute: async (args: { value: number; fromUnit: string; toUnit: string }) => {
    const toLiters: Record<string, number> = {
      l: 1,
      ml: 0.001,
      gal: 3.78541,
      cup: 0.236588,
      oz: 0.0295735,
      m3: 1000,
    }

    const liters = args.value * toLiters[args.fromUnit]
    const result = liters / toLiters[args.toUnit]

    return {
      result: result,
      value: args.value,
      fromUnit: args.fromUnit,
      toUnit: args.toUnit,
      formula: `${args.value} ${args.fromUnit} = ${result.toFixed(4)} ${args.toUnit}`,
    }
  },
}

toolRegistry.register(volumeTool)
```

Then add to `src/tools/converters/index.ts`:
```typescript
import "./volume.js"
```

---

## 🔒 Adding Validation & Error Handling

### Create Validation Utility (`src/utils/validation.ts`)

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export function validateNumber(
  value: any,
  name: string,
  options: { min?: number; max?: number } = {}
): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new ValidationError(`${name} must be a valid number`)
  }

  if (options.min !== undefined && value < options.min) {
    throw new ValidationError(`${name} must be at least ${options.min}`)
  }

  if (options.max !== undefined && value > options.max) {
    throw new ValidationError(`${name} must be at most ${options.max}`)
  }

  return value
}

export function validateEnum(value: any, name: string, allowedValues: string[]): string {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${name} must be one of: ${allowedValues.join(", ")}`
    )
  }
  return value
}
```

### Use in Tools

```typescript
import { validateNumber, validateEnum } from "../utils/validation.js"

const bmiTool: MCPTool = {
  // ... schema ...
  execute: async (args) => {
    // Validate inputs
    const weight = validateNumber(args.weight, "weight", { min: 20, max: 500 })
    const height = validateNumber(args.height, "height", { min: 50, max: 300 })
    const weightUnit = validateEnum(args.weightUnit, "weightUnit", ["kg", "lbs"])
    const heightUnit = validateEnum(args.heightUnit, "heightUnit", ["cm", "in"])

    // ... rest of logic ...
  },
}
```

---

## 📝 Adding Logging

### Create Logger (`src/utils/logger.ts`)

```typescript
export class Logger {
  static info(message: string, data?: any) {
    console.error(`[INFO] ${message}`, data ? JSON.stringify(data) : "")
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error)
  }

  static debug(message: string, data?: any) {
    if (process.env.DEBUG === "true") {
      console.error(`[DEBUG] ${message}`, data ? JSON.stringify(data) : "")
    }
  }

  static toolCall(toolName: string, args: any) {
    this.info(`Tool called: ${toolName}`, args)
  }

  static toolResult(toolName: string, result: any) {
    this.debug(`Tool result: ${toolName}`, result)
  }
}
```

### Use in Server

```typescript
// In src/index.ts
this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  Logger.toolCall(name, args)

  try {
    const tool = toolRegistry.getTool(name)
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`)
    }

    const result = await tool.execute(args)
    Logger.toolResult(name, result)

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    }
  } catch (error) {
    Logger.error(`Tool execution failed: ${name}`, error)
    // ... error handling ...
  }
})
```

---

## 🎯 Production Deployment

### Option 1: Serverless (Vercel)

Create `api/mcp.ts`:
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { VercelRequest, VercelResponse } from "@vercel/node"
// Import your server logic

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle MCP requests
  // Return JSON responses
}
```

### Option 2: Docker Container

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t convert-all-mcp .
docker run -p 3001:3001 convert-all-mcp
```

### Option 3: PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start dist/index.js --name convert-all-mcp
pm2 save
pm2 startup
```

---

## ✅ Checklist

- [ ] Install MCP SDK and dependencies
- [ ] Create project structure
- [ ] Implement main server file
- [ ] Create tool registry
- [ ] Implement 5 Phase 1 tools
- [ ] Add validation and error handling
- [ ] Add logging
- [ ] Write tests
- [ ] Test with MCP Inspector
- [ ] Integrate with Claude Desktop
- [ ] Document all tools
- [ ] Deploy to production
- [ ] Monitor usage and errors

---

## 📚 Resources

- **MCP Documentation:** https://modelcontextprotocol.io/docs
- **MCP SDK:** https://github.com/modelcontextprotocol/sdk
- **MCP Inspector:** https://github.com/modelcontextprotocol/inspector
- **Example Servers:** https://github.com/modelcontextprotocol/servers

---

## 🎉 Next Steps

1. Implement Phase 1 tools (5 tools)
2. Test thoroughly with MCP Inspector
3. Deploy to production
4. Implement Phase 2 tools (18 more unit converters)
5. Add remaining calculators
6. Implement developer tools
7. Monitor usage and iterate

**You now have a complete guide to building the MCP server!** 🚀
