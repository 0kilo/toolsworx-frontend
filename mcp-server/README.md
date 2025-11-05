# Convert-All MCP Server

Model Context Protocol (MCP) server for the Convert-All platform. Provides conversion, calculator, and developer tools through the official MCP SDK.

## Features

### Conversion Tools
- **Length Converter** - Convert between m, km, cm, mm, ft, in, mi, yd
- **Weight Converter** - Convert between kg, g, mg, lb, oz, ton
- **Temperature Converter** - Convert between Celsius, Fahrenheit, Kelvin

### Calculator Tools
- **BMI Calculator** - Calculate Body Mass Index with health categories
- **Mortgage Calculator** - Calculate monthly mortgage payments
- **Percentage Calculator** - Calculate percentages, increases, and decreases

### Developer Tools
- **JSON Formatter** - Format, minify, and validate JSON
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **UUID Generator** - Generate UUIDs (v4) in bulk
- **URL Encoder/Decoder** - Encode and decode URL components
- **Timestamp Converter** - Convert Unix timestamps to human-readable dates

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

### With MCP Inspector

```bash
# Start the inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

### Direct Usage

```bash
# Run the server
node dist/index.js
```

The server uses stdio transport and communicates via JSON-RPC over stdin/stdout.

## Tool Examples

### Convert Length

```json
{
  "name": "convert-length",
  "arguments": {
    "value": 5,
    "fromUnit": "km",
    "toUnit": "mi"
  }
}
```

### Calculate BMI

```json
{
  "name": "calculate-bmi",
  "arguments": {
    "weight": 70,
    "weightUnit": "kg",
    "height": 175,
    "heightUnit": "cm"
  }
}
```

### Format JSON

```json
{
  "name": "format-json",
  "arguments": {
    "jsonData": "{\"name\":\"John\",\"age\":30}",
    "operation": "format",
    "indent": 2
  }
}
```

### Generate UUIDs

```json
{
  "name": "generate-uuid",
  "arguments": {
    "count": 5
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch

# Clean build directory
npm run clean
```

## Architecture

The MCP server is built using:
- **@modelcontextprotocol/sdk** - Official MCP SDK
- **TypeScript** - Type-safe implementation
- **Stdio Transport** - Communication via stdin/stdout

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts                    # Main MCP server
│   └── tools/
│       ├── conversion-tools.ts     # Length, weight, temperature converters
│       ├── calculator-tools.ts     # BMI, mortgage, percentage calculators
│       └── developer-tools.ts      # JSON, Base64, UUID, URL, timestamp tools
├── dist/                           # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

All tools include comprehensive error handling:
- Input validation with min/max constraints
- Type checking for all parameters
- Proper MCP error codes (MethodNotFound, InvalidParams, InternalError)
- Detailed error messages for debugging

## Testing

Test the server with the MCP Inspector:

```bash
# Install inspector globally
npm install -g @modelcontextprotocol/inspector

# Test the server
mcp-inspector node dist/index.js
```

Or use the Claude Desktop app to test tools interactively.

## Future Enhancements

- [ ] OAuth authentication support
- [ ] Additional conversion tools (area, volume, speed, etc.)
- [ ] More calculator types (investment, savings, tax, etc.)
- [ ] File conversion integration with backend services
- [ ] Media conversion tools
- [ ] Image filter tools

## License

MIT

## Related Services

This MCP server complements the Convert-All backend services:
- **File Conversion Service** (Port 3000) - Document and file format conversions
- **Media Conversion Service** (Port 3001) - Video and audio conversions
- **Filter Service** (Port 3002) - Image filtering

See `/backend/README.md` for backend service documentation.
