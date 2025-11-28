import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { CheatSheet } from '@/components/shared/cheat-sheet'

export const metadata: Metadata = generateSEO({
  title: 'Filters & Effects Cheat Sheet - Image, Audio & Text Processing',
  description: 'Complete guide to image filters, audio effects, and text processing techniques with parameters and usage examples.',
  keywords: [
    'image filters guide',
    'audio effects',
    'text processing',
    'photo editing',
    'filter parameters',
    'effects cheat sheet'
  ],
  canonical: 'https://toolsworx.com/filters-cheatsheet',
})

const cheatSheetContent = `
# Filters & Effects Quick Reference

## Image Filters

### Basic Adjustments

#### Brightness
- **Range:** -100 to +100
- **Formula:** $\\text{new} = \\text{original} + \\text{brightness}$
- **Use:** Lighten/darken images
- **Example:** +20 for slightly brighter

#### Contrast
- **Range:** -100 to +100
- **Formula:** $\\text{new} = (\\text{original} - 128) \\times \\text{factor} + 128$
- **Use:** Increase/decrease difference between light and dark
- **Example:** +30 for more dramatic contrast

#### Saturation
- **Range:** -100 to +100
- **Formula:** Blend between original and grayscale
- **Use:** Make colors more/less vivid
- **Example:** -50 for muted colors, +25 for vibrant

### Color Effects

#### Grayscale Conversion
**Luminance Formula:**
$$\\text{Gray} = 0.299R + 0.587G + 0.114B$$

**Use cases:**
- Black and white photography
- Reducing file size
- Accessibility improvements
- Vintage effects

#### Sepia Tone
**Sepia Formula:**
- $R_{new} = 0.393R + 0.769G + 0.189B$
- $G_{new} = 0.349R + 0.686G + 0.168B$
- $B_{new} = 0.272R + 0.534G + 0.131B$

**Characteristics:**
- Warm, brownish tone
- Vintage/antique appearance
- Popular for portraits

#### Color Inversion (Negative)
**Formula:** $\\text{new} = 255 - \\text{original}$
- White becomes black
- Black becomes white
- Colors become complementary

### Artistic Filters

#### Blur Effects
- **Gaussian Blur:** Smooth, natural blur
- **Motion Blur:** Directional blur effect
- **Radial Blur:** Circular blur from center
- **Parameters:** Radius (1-50 pixels typical)

#### Sharpen
- **Unsharp Mask:** Most common sharpening
- **Parameters:** Amount, Radius, Threshold
- **Use:** Enhance edge definition
- **Caution:** Can introduce artifacts

#### Vintage/Retro Effects
**Common characteristics:**
- Reduced saturation
- Warm color temperature
- Vignetting (dark edges)
- Film grain texture
- Faded appearance

### Filter Combinations

#### Instagram-style Filters
**Valencia:**
- Increase warmth (+15)
- Add slight vignette
- Boost contrast (+10)
- Reduce saturation (-5)

**Nashville:**
- Warm temperature
- Reduce contrast (-10)
- Add pink/purple tint
- Increase brightness (+5)

## Audio Effects

### Basic Audio Processing

#### Volume/Gain
- **Range:** -∞ dB to +20 dB
- **0 dB:** Original level
- **-6 dB:** Half volume
- **+6 dB:** Double volume
- **Formula:** $\\text{dB} = 20 \\log_{10}(\\frac{\\text{new}}{\\text{original}})$

#### Normalize
- **Purpose:** Maximize volume without clipping
- **Process:** Find peak, scale to target level
- **Target:** Usually -1 dB to -3 dB

### Frequency Effects

#### Bass Boost
- **Frequency Range:** 20 Hz - 250 Hz
- **Typical Boost:** +3 dB to +6 dB
- **Use:** Enhance low-end for music
- **Caution:** Can cause distortion

#### Treble Enhancement
- **Frequency Range:** 2 kHz - 20 kHz
- **Typical Boost:** +2 dB to +4 dB
- **Use:** Add clarity and presence
- **Effect:** Brighter, more detailed sound

#### Equalizer Bands
| Frequency | Description | Effect |
|-----------|-------------|--------|
| 60 Hz | Sub-bass | Rumble, depth |
| 170 Hz | Bass | Warmth, fullness |
| 310 Hz | Low-mid | Body, thickness |
| 600 Hz | Mid | Presence |
| 1 kHz | Upper-mid | Clarity |
| 3 kHz | High-mid | Definition |
| 6 kHz | Treble | Brightness |
| 12 kHz | High treble | Air, sparkle |

### Time-based Effects

#### Echo
- **Parameters:** Delay time, feedback, mix
- **Delay Time:** 50ms - 2000ms
- **Use:** Add space and depth
- **Example:** 250ms delay, 25% feedback

#### Reverb
- **Types:** Room, Hall, Plate, Spring
- **Parameters:** Size, decay time, damping
- **Use:** Simulate acoustic spaces
- **Settings:** 
  - Small room: 0.5s decay
  - Large hall: 2-4s decay

### Noise Processing

#### Noise Reduction
- **Process:** 
  1. Analyze noise profile
  2. Apply spectral subtraction
  3. Smooth transitions
- **Parameters:** Reduction amount, sensitivity
- **Use:** Clean up recordings

#### Noise Gate
- **Purpose:** Remove background noise during silence
- **Parameters:** Threshold, attack, release
- **Threshold:** -40 dB to -20 dB typical

## Text Processing

### Case Conversion
\`\`\`
Original: "Hello World Example"
UPPERCASE: "HELLO WORLD EXAMPLE"
lowercase: "hello world example"
Title Case: "Hello World Example"
camelCase: "helloWorldExample"
snake_case: "hello_world_example"
kebab-case: "hello-world-example"
\`\`\`

### Text Extraction

#### Email Extraction
**Regex Pattern:**
\`\`\`regex
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
\`\`\`

**Example matches:**
- user@example.com
- test.email+tag@domain.co.uk
- name123@sub.domain.org

#### URL Extraction
**Regex Pattern:**
\`\`\`regex
https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)
\`\`\`

**Example matches:**
- https://example.com
- http://www.site.org/path?param=value
- https://sub.domain.co.uk/page#section

### Data Cleaning

#### CSV Cleaning
**Common issues:**
- Extra whitespace
- Inconsistent delimiters
- Missing quotes
- Encoding problems

**Solutions:**
\`\`\`
Trim whitespace: "  data  " → "data"
Standardize quotes: 'text' → "text"
Fix delimiters: semicolon → comma
Handle line breaks in fields
\`\`\`

#### JSON Formatting
**Minified:**
\`\`\`json
{"name":"John","age":30,"city":"NYC"}
\`\`\`

**Formatted (2-space indent):**
\`\`\`json
{
  "name": "John",
  "age": 30,
  "city": "NYC"
}
\`\`\`

## Filter Parameters Guide

### Image Filter Intensity
- **0%:** No effect (original)
- **25%:** Subtle effect
- **50%:** Moderate effect
- **75%:** Strong effect
- **100%:** Maximum effect

### Audio Effect Levels
- **Subtle:** 10-20% mix
- **Moderate:** 30-50% mix
- **Dramatic:** 60-80% mix
- **Extreme:** 90-100% mix

### Best Practices

#### Image Processing
1. **Work with copies** of original files
2. **Apply filters in order** (color → exposure → effects)
3. **Use subtle settings** for natural results
4. **Preview before applying** to entire image
5. **Save in appropriate format** (PNG for graphics, JPEG for photos)

#### Audio Processing
1. **Monitor levels** to prevent clipping
2. **Use reference tracks** for comparison
3. **Apply effects gradually** (multiple small changes)
4. **Check on different speakers** for consistency
5. **Keep unprocessed backup** for comparison

*Note: Advanced filter algorithms and professional techniques will be added soon.*
`

export default function FiltersCheatSheetPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CheatSheet
            title="Filters & Effects Cheat Sheet"
            description="Complete guide to image filters, audio effects, and text processing"
            content={cheatSheetContent}
            category="filters"
          />
        </div>
        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}