import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'Developer Tools Cheat Sheet - Encoding, Hashing & Utilities',
  description: 'Quick reference for developers: Base64 encoding, URL encoding, hash functions, JSON formatting, and essential development utilities.',
  keywords: [
    'developer tools cheat sheet',
    'base64 encoding',
    'url encoding',
    'hash functions',
    'json formatting',
    'developer utilities'
  ],
  canonical: 'https://toolsworx.com/developer-tools-cheatsheet',
})

const cheatSheetContent = `
# Developer Tools Quick Reference

## Encoding & Decoding

### Base64 Encoding
**Purpose:** Convert binary data to ASCII text
**Use cases:** Email attachments, data URLs, API tokens

**Example:**
\`\`\`
Text: "Hello World"
Base64: "SGVsbG8gV29ybGQ="
\`\`\`

**Data URL Example:**
\`\`\`
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==
\`\`\`

### URL Encoding (Percent Encoding)
**Purpose:** Encode special characters in URLs
**Format:** %XX (hexadecimal)

| Character | Encoded | Description |
|-----------|---------|-------------|
| Space | %20 | Space character |
| ! | %21 | Exclamation mark |
| " | %22 | Quotation mark |
| # | %23 | Hash/pound |
| $ | %24 | Dollar sign |
| % | %25 | Percent sign |
| & | %26 | Ampersand |
| + | %2B | Plus sign |
| ? | %3F | Question mark |

**Example:**
\`\`\`
Original: "Hello World & More!"
Encoded:  "Hello%20World%20%26%20More%21"
\`\`\`

### HTML Entity Encoding
| Character | Entity | Numeric |
|-----------|--------|---------|
| < | &lt; | &#60; |
| > | &gt; | &#62; |
| & | &amp; | &#38; |
| " | &quot; | &#34; |
| ' | &apos; | &#39; |

## Hash Functions

### MD5 (Message Digest 5)
- **Output:** 128-bit (32 hex characters)
- **Security:** Broken, not for passwords
- **Use:** File integrity, checksums
- **Example:** "hello" → "5d41402abc4b2a76b9719d911017c592"

### SHA-1 (Secure Hash Algorithm 1)
- **Output:** 160-bit (40 hex characters)
- **Security:** Deprecated for security
- **Use:** Legacy systems, Git commits
- **Example:** "hello" → "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"

### SHA-256
- **Output:** 256-bit (64 hex characters)
- **Security:** Currently secure
- **Use:** Passwords (with salt), certificates
- **Example:** "hello" → "2cf24dba4f21d4288094e9b9eb4e5f164359294e"

### Hash Security Guidelines
1. **Never use MD5 or SHA-1 for passwords**
2. **Always use salt with password hashes**
3. **Use bcrypt, scrypt, or Argon2 for passwords**
4. **SHA-256+ acceptable for data integrity**

## JSON (JavaScript Object Notation)

### Basic Structure
\`\`\`json
{
  "string": "value",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value"
  }
}
\`\`\`

### Data Types
- **String:** "text" (double quotes required)
- **Number:** 42, 3.14, -17, 1.2e-3
- **Boolean:** true, false
- **null:** null
- **Array:** [1, 2, 3]
- **Object:** {"key": "value"}

### Common JSON Operations
\`\`\`javascript
// Parse JSON string
const obj = JSON.parse('{"name": "John"}');

// Convert to JSON string
const json = JSON.stringify({name: "John"});

// Pretty print (formatted)
const formatted = JSON.stringify(obj, null, 2);
\`\`\`

### JSON Validation Rules
- ✅ Double quotes for strings
- ✅ No trailing commas
- ✅ No comments allowed
- ❌ Single quotes: 'invalid'
- ❌ Trailing comma: {"a": 1,}
- ❌ Comments: // not allowed

## UUID (Universally Unique Identifier)

### UUID Versions
- **UUID v1:** Timestamp + MAC address
- **UUID v4:** Random (most common)
- **UUID v5:** Namespace + name (SHA-1)

### UUID v4 Format
\`\`\`
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
Example: 550e8400-e29b-41d4-a716-446655440000
\`\`\`

### Use Cases
- Database primary keys
- Session identifiers
- File names
- API request IDs

## Regular Expressions (Regex)

### Common Patterns
\`\`\`regex
Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
Phone: ^\\+?[1-9]\\d{1,14}$
URL: ^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$
IP Address: ^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$
\`\`\`

### Regex Modifiers
- **g:** Global (find all matches)
- **i:** Case insensitive
- **m:** Multiline
- **s:** Dot matches newline

## HTTP Status Codes

### Success (2xx)
- **200:** OK
- **201:** Created
- **204:** No Content

### Redirection (3xx)
- **301:** Moved Permanently
- **302:** Found (Temporary Redirect)
- **304:** Not Modified

### Client Error (4xx)
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **429:** Too Many Requests

### Server Error (5xx)
- **500:** Internal Server Error
- **502:** Bad Gateway
- **503:** Service Unavailable

## Timestamp Formats

### Unix Timestamp
- **Format:** Seconds since January 1, 1970 UTC
- **Example:** 1640995200 = 2022-01-01 00:00:00 UTC

### ISO 8601
- **Format:** YYYY-MM-DDTHH:mm:ss.sssZ
- **Example:** 2022-01-01T00:00:00.000Z

### Conversion Formulas
\`\`\`javascript
// Unix to Date
const date = new Date(timestamp * 1000);

// Date to Unix
const timestamp = Math.floor(date.getTime() / 1000);

// Current Unix timestamp
const now = Math.floor(Date.now() / 1000);
\`\`\`

## Color Codes

### Hex Colors
\`\`\`
#RRGGBB format
#FF0000 = Red
#00FF00 = Green
#0000FF = Blue
#FFFFFF = White
#000000 = Black
\`\`\`

### RGB/RGBA
\`\`\`css
rgb(255, 0, 0)     /* Red */
rgba(255, 0, 0, 0.5) /* Semi-transparent red */
\`\`\`

### HSL/HSLA
\`\`\`css
hsl(0, 100%, 50%)     /* Red */
hsla(0, 100%, 50%, 0.5) /* Semi-transparent red */
\`\`\`

## Quick Reference Commands

### Git
\`\`\`bash
git status          # Check status
git add .           # Stage all changes
git commit -m "msg" # Commit with message
git push            # Push to remote
git pull            # Pull from remote
\`\`\`

### npm/Node.js
\`\`\`bash
npm init            # Initialize project
npm install package # Install package
npm run script     # Run script
node file.js       # Run JavaScript file
\`\`\`

*Note: Advanced topics like JWT tokens, OAuth flows, and API design patterns will be added soon.*
`

export default function DeveloperToolsCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="Developer Tools Cheat Sheet"
            description="Essential reference for encoding, hashing, JSON, and development utilities"
            content={cheatSheetContent}
            category="developer-tools"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}