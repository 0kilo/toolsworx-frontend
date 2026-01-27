# MCP Server (Tools Worx)

This MCP server provides file conversion, media conversion, and filter tools over HTTP.

## Endpoint
- Base URL: `https://api.toolsworx.com/mcp`
- Transport: Streamable HTTP
- Auth: API key required (`x-api-key` or `Authorization: Bearer <key>`)
- Max payload: **12MB** (base64 overhead included)

## API Key Format
```
twx_<env>_<publicId>.<secret>
```
- Example: `twx_live_ab12cdef.3o2s...`
- Generated in `/account/api-keys` after sign-in.

## Supported Tools

### file.convert
Document + spreadsheet conversion via base64.
- Input formats: `pdf, doc, docx, odt, rtf, txt, html, xlsx, xls, csv, ods`
- Output formats: same as above (must be compatible with input type)

### media.convert
Image/audio/video conversion via base64.
- Images: `jpg, jpeg, png, webp, gif, bmp, tiff`
- Audio/Video: handled by ffmpeg (depends on container/codec support)

### image.filter
Apply image filters via base64.
- Filters: `grayscale, blur, sharpen, brightness, contrast, saturation, hue, sepia, vintage`
- Output format default: `jpeg`

### audio.filter
Apply audio filters via base64.
- Filters: `equalizer, reverb, echo, noise-reduction, normalize, bass-boost`
- Output format default: `mp3` (override with `options.outputFormat`)

## Client config (example `mcp.json`)
```json
{
  "mcpServers": {
    "toolsworx": {
      "type": "http",
      "url": "https://api.toolsworx.com/mcp",
      "description": "Tools Worx MCP server for conversions and filters",
      "auth": {
        "type": "api_key",
        "header": "x-api-key",
        "value": "twx_live_<publicId>.<secret>"
      }
    }
  }
}
```

## Notes
- Inputs must be base64 without a `data:` URL prefix.
- Output is returned as base64 along with a filename.
