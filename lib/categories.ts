import { Ruler, Calculator, FileText, Film, Code2, Sliders, Heart, BarChart3, Truck, BookOpen, LucideIcon } from "lucide-react"

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
  sections?: {
    title: string
    bullets: string[]
  }[]
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "helpful-calculators",
    title: "Helpful Tools",
    description: "Practical tools for everyday tasks",
    longDescription:
      "Our helpful tools make everyday tasks easier. Scale recipes for different serving sizes, generate secure passwords, create API keys and UUIDs, and convert crypto or fiat currencies. These practical tools save time and help you plan better.",
    icon: Heart,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["helpful"],
    seoKeywords: [
      "recipe scaler",
      "api key generator",
      "uuid generator",
      "shipping cost calculator",
      "password generator",
      "crypto converter",
      "currency converter",
      "recipe calculator",
      "gift exchange",
      "countdown timer",
      "helpful tools",
      "everyday tools",
      "shipping calculator",
      "package shipping",
      "holiday timer",
      "secure password",
      "cryptocurrency",
    ],
    benefits: [
      "Perfect for everyday tasks",
      "Easy to use interface",
      "Instant results",
      "Free and no registration required",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Everyday utilities that remove friction from planning, sharing, and organizing so non-technical users can get quick wins without setup.",
          "Mobile-friendly flows let you finish tasks like scaling recipes or creating gift lists in seconds from any device.",
          "Built for repeat use with clear defaults and simple inputs that prevent common mistakes (serving sizes, exclusions, dates).",
          "No sign-up or email capture; privacy-first for lightweight household and office tasks.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Adjust servings or ingredient lists with the Recipe Scaler when cooking for more or fewer people.",
          "Generate strong credentials with the Password Generator before enabling new accounts or rotating logins.",
          "Create API keys or unique IDs for apps and integrations without touching a terminal.",
          "Handle quick financial lookups with the Crypto Converter when quoting, budgeting, or paying in digital assets.",
          "Use the Currency Converter for fiat exchange checks before travel, invoices, or international purchases.",
        ],
      },
      {
        title: "How to Choose the Right Tool",
        bullets: [
          "Use Recipe Scaler for quantity math; switch to calculators category if you need nutrition or macro math.",
          "Pick Password Generator for login security; use the API Key Generator for IDs or integration tokens.",
          "Crypto Converter is for spot checks; use Currency Converter for fiat-only comparisons.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Keep ingredient units consistent before scaling to avoid rounding surprises.",
          "Store generated passwords in a manager; do not reuse or email them.",
          "Prefix API keys by environment (dev_, prod_) to avoid mix-ups.",
          "Refresh crypto quotes close to checkout; prices move quickly and can invalidate earlier totals.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Mixing cups, grams, and ounces in the same recipe scale leads to bad ratios; standardize units first.",
          "Sharing password results over chat or email defeats security; deliver via a password manager instead.",
          "Relying on stale crypto rates can undercharge or overcharge; refresh before submitting payments.",
          "Using IDs as secrets; use proper API keys or hashed tokens for sensitive access.",
        ],
      },
    ],
  },
  {
    id: "unit-conversions",
    title: "Unit Conversions",
    description: "Convert between different units of measurement",
    longDescription:
      "Our unit conversion tools make it easy to convert between different units of measurement. Whether you need to convert temperature, distance, weight, volume, time, or other units, our calculators provide accurate results instantly. Perfect for students, professionals, travelers, and anyone who needs quick unit conversions.",
    icon: Ruler,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["temperature", "distance", "weight", "volume", "time", "speed", "area", "energy", "pressure", "data"],
    seoKeywords: [
      "unit converter",
      "measurement converter",
      "convert units",
      "temperature conversion",
      "distance conversion",
      "weight conversion",
      "volume conversion",
      "time converter",
      "speed converter",
      "area converter",
      "energy converter",
      "metric conversion",
      "imperial conversion",
      "astronomical units",
      "light years",
      "parsecs",
    ],
    benefits: [
      "Instant and accurate conversions",
      "Support for metric and imperial units",
      "No installation or registration required",
      "Perfect for students and professionals",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "One-stop hub for temperature, distance, weight, volume, time, speed, area, energy, pressure, and data conversions.",
          "Built for clarity on mobile: single-input focus, clear unit labels, and instant results for fast lookups.",
          "Accurate math backed by consistent formulas so engineers, students, and travelers can trust outputs.",
          "No ads inside the calculator panels; streamlined UI for repeated, distraction-free use.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Temperature: cooking, HVAC tuning, lab work, or travel between Fahrenheit, Celsius, and Kelvin contexts.",
          "Distance/Area: shipping dimensions, land measurement, mapping, or workout tracking across metric/imperial.",
          "Energy/Pressure: science labs, automotive tire pressure, HVAC, or mechanical engineering lookups.",
          "Data Size: storage planning, download estimates, or cloud cost sizing from bytes to terabytes.",
        ],
      },
      {
        title: "How to Choose the Right Converter",
        bullets: [
          "Pick specialized converters (pressure, energy) when you need domain-specific units rather than generic calculators.",
          "Use Data Size for digital contexts; avoid mixing decimal (GB) and binary (GiB) without checking which you need.",
          "Select Speed for travel/fitness; switch to Time when calculating durations or offsets.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Double-check source units before input; most errors come from assuming imperial vs metric defaults.",
          "For scientific work, note significant figures; round outputs based on your required precision.",
          "When sharing results, include both units to prevent ambiguity in specs and handoffs.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Mixing metric and imperial in the same calculation (e.g., cm with inches) produces wrong outputs; keep units consistent.",
          "Rounding early on chained conversions hides small errors; round only at the end when precision matters.",
          "Temperature conversions need offsets (C/F) not just multipliers; avoid treating them like linear scale-only changes.",
          "For pressure and energy, verify the specific unit variant (psi vs psig, joule vs watt-hour) before converting.",
          "Data size conversions differ between decimal (GB) and binary (GiB); pick the standard your platform expects.",
        ],
      },
    ],
  },
  {
    id: "calculators",
    title: "Calculators",
    description: "Calculate values for various purposes",
    longDescription:
      "Our online calculators help you quickly calculate important values for everyday tasks and professional use. From financial calculations like mortgage and loan payments to health metrics like BMI and calorie needs, our calculators provide instant, accurate results. All calculators are free to use and work on any device.",
    icon: Calculator,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["calculator"],
    seoKeywords: [
      "online calculator",
      "free calculator",
      "mortgage calculator",
      "bmi calculator",
      "loan calculator",
      "percentage calculator",
      "tip calculator",
      "date calculator",
      "scientific calculator",
      "graphing calculator",
      "lorentz transformation",
      "relativity calculator",
      "physics calculator",
      "math calculator",
      "financial calculator",
    ],
    benefits: [
      "Easy-to-use interface",
      "Accurate calculations every time",
      "Works on mobile and desktop",
      "Completely free, no limits",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Financial, health, and utility calculators with guardrails that prevent common input mistakes.",
          "Clear labels and helper text so non-experts can trust the numbers without reading a manual.",
          "Optimized for small screens to make quick decisions in stores, meetings, or travel.",
          "No sign-up; calculations run locally so you can rerun scenarios quickly.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Loan & Mortgage: payment sizing, comparing rates/terms, or pre-approval preparation.",
          "BMI/Calorie/Protein: health tracking, training plans, or doctor/coach conversations.",
          "Tip/Percentage/Date: on-the-go math for dining, discounts, and scheduling.",
          "Graphing/Scientific: coursework, quick plotting, or validating formulas.",
          "Paint/Flooring/Concrete: home projects needing materials and cost estimates.",
        ],
      },
      {
        title: "How to Choose the Right Calculator",
        bullets: [
          "Use Tip for single receipts; Percentage for discounts, markups, or tax scenarios.",
          "Pick Loan/Mortgage when amortization matters; switch to Interest-only if you just need simple growth math.",
          "Graphing for visual checks; Scientific for trig, logs, and multi-step equations.",
          "Project calculators (paint/flooring/concrete) include waste factors—use them instead of manual area math.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Enter units consistently (ft vs m) before area-based estimates to avoid costly overruns.",
          "Stress-test loans by adding 1-2% to rates to see payment sensitivity before committing.",
          "For nutrition, confirm activity multipliers match your routine; avoid overestimating burn.",
          "Save plots or outputs as screenshots for quick sharing with teammates or contractors.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Using monthly rates when the calculator expects annual APR leads to wrong payments; match the input labels.",
          "Mixing imperial and metric in project calculators skews material estimates; pick one system and stick to it.",
          "Relying on default activity multipliers for calories can overstate burn; adjust to your real training load.",
          "For tip/percentage math, ensure the base amount excludes taxes or add-ons if your locale uses pre-tax tipping.",
          "Graphing without labeling axes or units confuses results; add notes before sharing screenshots.",
        ],
      },
    ],
  },
  {
    id: "adventure",
    title: "Adventure Tools",
    description: "Planning tools for travel, rides, and outdoor trips",
    longDescription:
      "Adventure tools help travelers, cyclists, campers, backpackers, and motorcyclists plan safer and more efficient trips. Estimate route time and cost, plan fuel and water, optimize pack weight, and generate practical checklists for the road or trail.",
    icon: Truck,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["adventure"],
    seoKeywords: [
      "adventure tools",
      "travel planner",
      "route planner",
      "trip budget calculator",
      "fuel stop planner",
      "packing checklist",
      "backpacking gear list",
      "camping planner",
      "bike ride planner",
      "motorcycle trip planner",
    ],
    benefits: [
      "Fast planning for outdoor and travel scenarios",
      "Mobile-friendly for use on the go",
      "Covers packing, timing, and budgeting",
      "Free tools with instant results",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Built for real-world trip prep across road, trail, and flight contexts.",
          "Combines timing, fuel, budget, and checklist workflows in one category.",
          "Designed for quick edits as plans change due to weather or route updates.",
          "Works well on mobile so you can plan while in transit.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Plan route timing and fuel stops before long rides or drives.",
          "Estimate food, water, and pack weight for camping and backpacking.",
          "Build packing and safety checklists before departure.",
          "Model costs with a budget buffer for currency changes and surprises.",
        ],
      },
      {
        title: "How to Choose the Right Tool",
        bullets: [
          "Use pace/ETA tools first to set your timeline.",
          "Then run cost, fuel, and resource estimators for logistics.",
          "Finish with packing and emergency-card tools before leaving.",
          "Recheck weather-risk scoring close to departure time.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Add safety buffers for fuel, weather, and timing assumptions.",
          "Use conservative pace estimates when terrain or traffic is uncertain.",
          "Keep a lightweight essentials list that appears on every trip plan.",
          "Save final outputs for offline access before heading out.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Underestimating breaks and setup time in total ETA calculations.",
          "Using ideal fuel economy instead of real-world loaded conditions.",
          "Ignoring resupply gaps for water/food on remote routes.",
          "Packing by habit instead of weight and weather conditions.",
        ],
      },
    ],
  },
  {
    id: "blog",
    title: "Blog",
    description: "Travel stories and real-world tool walkthroughs",
    longDescription:
      "The ToolsWorx blog documents real adventures and practical applications of our tools. Adventures posts capture travel logs and field notes, while Applications posts show step-by-step planning workflows using calculators and converters on actual trips.",
    icon: BookOpen,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["blog"],
    seoKeywords: [
      "travel blog",
      "adventure blog",
      "tool application examples",
      "trip planning case study",
      "route planning blog",
      "camping planning guide",
      "motorcycle route planning",
      "travel documentary",
    ],
    benefits: [
      "Real-world examples from actual travel and planning",
      "Actionable workflows for route, budget, and packing",
      "Simple registry-driven publishing model",
      "Easy to discover via category and home pages",
    ],
    sections: [
      {
        title: "What You'll Find",
        bullets: [
          "Adventures: documentary-style trip logs with route and context notes.",
          "Applications: practical walkthroughs showing how to apply tools to real scenarios.",
          "Link-rich posts that connect planning assumptions to outcomes.",
          "Reusable ideas you can adapt for your own trips.",
        ],
      },
      {
        title: "How To Use These Posts",
        bullets: [
          "Start with an Adventures post for context and itinerary framing.",
          "Open a paired Applications post to replicate the planning workflow.",
          "Adjust assumptions (fuel, pace, budget, weather) to match your conditions.",
          "Export and save your own summaries before departure.",
        ],
      },
    ],
  },
  {
    id: "file-converters",
    title: "File Converters",
    description: "Convert documents and files between formats",
    longDescription:
      "Convert your files between different formats with our easy-to-use file conversion tools. Transform PDFs to Word documents, Excel spreadsheets to CSV, and more. Our converters maintain formatting and quality while ensuring your privacy – all files are automatically deleted after conversion.",
    icon: FileText,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["document", "spreadsheet", "data", "encoding", "archive"],
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
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Document, spreadsheet, data, encoding, and archive converters built for compatibility and privacy.",
          "Keep layouts intact when moving between PDF, DOCX, and other formats to reduce rework.",
          "Handle bulk archives without installing desktop tools—use the browser for quick turnarounds.",
          "Security-first approach: conversions complete fast and cleanup happens automatically.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Document: submit resumes, contracts, or reports in required formats (PDF, DOCX).",
          "Spreadsheet: swap between CSV/XLSX/ODS for imports into BI tools or ERPs.",
          "Data: reformat JSON/CSV/XML before uploads to APIs or databases.",
          "Archive: compress or extract when sharing multi-file deliverables.",
          "Base64: encode/decode files for embedding or transport in text-based systems.",
        ],
      },
      {
        title: "How to Choose the Right Converter",
        bullets: [
          "Use Spreadsheet when cell fidelity matters; use Data when structure/serialization matters more than formulas.",
          "Choose Archive for multi-file handoffs; avoid zipping encrypted files inside other zips to prevent issues.",
          "Pick Base64 only when transport requires text; otherwise share the original binary for size efficiency.",
          "If you need OCR or complex layouts, convert to an editable format first, then fix formatting before re-export.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Check fonts and margins after PDF/DOCX swaps; minor shifts can affect pagination.",
          "Before CSV exports, confirm delimiter and encoding (UTF-8) to avoid import failures.",
          "For archives, keep names short and avoid special characters to prevent unzip errors on older systems.",
          "Never embed secrets in files before converting; strip credentials and PII first.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Uploading sensitive contracts or keys when a text scrub would suffice; always sanitize before converting.",
          "Using the wrong delimiter or encoding on CSV exports causes broken imports; set UTF-8 and the expected separator.",
          "Double-compressing archives makes them harder to open and larger; avoid nesting zips unless necessary.",
          "Expecting formulas to survive format changes (CSV drops them); convert to a formula-friendly format first.",
          "Renaming extensions without converting the file format leads to unreadable files; always convert properly.",
        ],
      },
    ],
  },
  {
    id: "media-converters",
    title: "Media Converters",
    description: "Convert images, videos, and audio files",
    longDescription:
      "Transform your media files with our powerful conversion tools. Convert images between formats like JPG, PNG, and WebP. Transform videos between MP4, WebM, and other formats. Convert audio files to different formats with customizable quality settings. All conversions are processed securely with automatic file deletion.",
    icon: Film,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
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
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Convert images, audio, and video with format, size, and quality options suitable for web and social sharing.",
          "Client-side emphasis keeps personal media private while you reformat or compress.",
          "Balanced presets to avoid quality loss while meeting upload limits or streaming constraints.",
          "Optimized for mobile so you can adjust media on the go before sending.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Images: switch between JPG/PNG/WebP for web performance, transparency, or print needs.",
          "Audio: convert WAV/FLAC to MP3/AAC for compatibility or smaller sizes; prep voiceovers.",
          "Video: reformat MP4/WebM for platform requirements or reduce bitrate for sharing.",
          "Pre-flight assets before uploading to CMS, LMS, or social platforms.",
        ],
      },
      {
        title: "How to Choose the Right Settings",
        bullets: [
          "Use WebP or optimized JPG for web; PNG for graphics needing transparency or lossless edges.",
          "Pick AAC/MP3 128–192kbps for voice/music balance; keep WAV/FLAC for editing or archiving.",
          "For video, choose MP4 (H.264) for widest support; lower resolution/bitrate for messaging apps.",
          "Match frame rate to source to avoid motion artifacts; only lower if size is critical.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Keep a lossless master before compressing; always derive lossy outputs from the best source.",
          "Test converted files on the target device/app before deleting originals.",
          "Avoid re-encoding lossy files multiple times; quality drops with each pass.",
          "For uploads with limits, downscale resolution before dropping bitrate to preserve clarity.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Re-encoding lossy files (MP3 to MP3, MP4 to MP4) repeatedly; always convert from the best available source.",
          "Dropping bitrate too far for speech or music, causing artifacts; use moderate settings and test on target devices.",
          "Ignoring aspect ratios when resizing video or images leads to distortion; lock aspect or crop intentionally.",
          "Choosing the wrong container/codec for the platform (e.g., FLAC on devices that only support MP3/AAC).",
          "Forgetting to match frame rate and sample rate to the destination platform, causing playback issues.",
        ],
      },
    ],
  },
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "Tools for developers, JSON formatters, and utilities",
    longDescription:
      "Essential tools for developers and technical professionals. Format and validate JSON, minify code, generate UUIDs, encode/decode Base64, test regular expressions, and more. All tools work directly in your browser with no server uploads, ensuring your code and data remain private.",
    icon: Code2,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["developer", "formatter", "validator"],
    seoKeywords: [
      "json formatter",
      "json validator",
      "json minifier",
      "base64 encode",
      "base64 decode",
      "uuid generator",
      "regex tester",
      "jwt decoder",
      "xml formatter",
      "csv formatter",
      "hash generator",
      "timestamp converter",
      "url encoder",
      "text case converter",
      "email extractor",
      "url extractor",
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
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Browser-based utilities for formatting, validating, encoding, and inspecting data without sending payloads to a server.",
          "Designed for quick copy/paste workflows so you can debug payloads during reviews or incidents.",
          "Consistent UI and output formatting to reduce cognitive load across tools.",
          "Privacy-by-default: keeps tokens, secrets, and customer data local.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Format/Minify/Validate JSON before committing or responding to API clients.",
          "Base64/URL encode-decode when crafting headers, webhooks, or debugging integrations.",
          "Hash/UUID/Timestamp tools for IDs, fixtures, and reproducible test data.",
          "Regex tester for quick pattern checks; CSV/XML formatters for log or data cleanup.",
        ],
      },
      {
        title: "How to Choose the Right Tool",
        bullets: [
          "Use Validator for schema sanity; Formatter for readability; Minifier for payload size tests.",
          "Pick Hash Generator for checksums; use JSON-based signing elsewhere for security contexts.",
          "Timestamp Converter for epoch/human swaps; keep timezone awareness in mind.",
          "Regex Tester for quick tries; avoid embedding overly complex patterns in production without review.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Never paste production secrets into third-party sites; these tools run locally to stay safe.",
          "Keep sample payloads small; large blobs are harder to inspect and can mask edge cases.",
          "Add comments in commit messages about transformations done to payloads for traceability.",
          "Validate before shipping—catch malformed JSON/CSV early to prevent runtime failures.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Confusing encode vs decode paths (Base64/URL); double-check direction before sending payloads.",
          "Using hashes as a security substitute for signatures; hashes alone do not provide authenticity.",
          "Forgetting timezone context in timestamp conversions; specify UTC vs local when sharing results.",
          "Pasting production secrets into external tools; rely on these local utilities instead.",
          "Validating only happy-path JSON; include edge cases like nulls, empty arrays, and unexpected types.",
        ],
      },
    ],
  },
  {
    id: "filters",
    title: "Filters & Effects",
    description: "Apply filters and effects to images, audio, and data",
    longDescription:
      "Transform your media and data with powerful filters and effects. Apply professional photo filters like grayscale, sepia, and Instagram-style effects. Enhance audio with equalizers, reverb, and noise reduction. Clean and format data with our text processing tools. All processing happens instantly in real-time.",
    icon: Sliders,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["image-filter", "audio-filter", "data-filter"],
    seoKeywords: [
      "image filters",
      "photo effects",
      "instagram filters",
      "audio effects",
      "audio filters",
      "equalizer",
      "reverb",
      "echo effect",
      "noise reduction",
      "bass boost",
      "audio normalize",
      "grayscale filter",
      "sepia filter",
      "blur effect",
      "brightness filter",
      "contrast filter",
      "data formatter",
      "text filters",
      "apply filter",
    ],
    benefits: [
      "Real-time filter preview",
      "Professional-quality effects",
      "No upload required for many filters",
      "Batch processing available",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Image and audio filters for quick cleanup and creative polish without heavyweight editors.",
          "Live previews let you fine-tune looks or sound before downloading.",
          "Handles common fixes (noise, normalization, EQ, blur/contrast) in one place.",
          "Private by design—processing happens client-side where possible.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Image Effects for social posts, product shots, or documents that need clarity.",
          "Text Processor for cleaning pasted data before analysis or import.",
          "Audio Equalizer/Normalize/Noise Reduction for podcasts, calls, and voiceovers.",
          "Reverb/Echo/Bass Boost for quick creative tweaks on demos and samples.",
        ],
      },
      {
        title: "How to Choose the Right Filter",
        bullets: [
          "Normalize before EQ to prevent clipping; reduce noise before adding effects.",
          "For photos, correct exposure/contrast first, then apply stylistic filters.",
          "Use Text Processor for whitespace, casing, and quick cleanup; switch to dev tools for structured formats.",
          "Bass Boost sparingly—use in combination with EQ cuts to avoid muddy mixes.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Export a clean version and a styled version so you can revert easily.",
          "Check results on mobile speakers and headphones; adjust EQ if harsh.",
          "Keep track of intensity sliders; incremental changes beat maxed-out effects.",
          "Avoid over-sharpening or over-saturating images to maintain a natural look.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Applying creative effects before cleaning noise; always reduce noise and normalize first.",
          "Over-boosting bass without level checks causes clipping; pair boosts with normalization.",
          "Stacking multiple strong image filters leads to artifacts; build effects gradually.",
          "Ignoring device differences; preview on phone and laptop to catch harsh EQ or over-saturation.",
          "Skipping versioning; export a neutral copy so you can roll back if a client prefers a cleaner look.",
        ],
      },
    ],
  },
  {
    id: "charts",
    title: "Charts",
    description: "Create interactive charts and visualizations",
    longDescription:
      "Create beautiful, interactive charts and visualizations with our D3.js-powered tools. Build Gantt charts for project management, generate charts from JSON data, or use our property builder to create custom visualizations. All charts can be shared and exported for presentations and reports.",
    icon: BarChart3,
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-900",
    iconColor: "text-slate-600",
    categories: ["chart"],
    seoKeywords: [
      "gantt chart",
      "chart generator",
      "data visualization",
      "interactive charts",
      "d3 charts",
      "project timeline",
      "chart builder",
      "json to chart",
    ],
    benefits: [
      "Interactive D3.js visualizations",
      "JSON data import support",
      "Visual property builder",
      "Shareable chart links",
    ],
    sections: [
      {
        title: "Introduction",
        bullets: [
          "Chart builders for pie, bar, line, area, scatter, Gantt, sunburst, and map visualizations.",
          "Simplified inputs with live previews so non-designers can validate before sharing.",
          "Supports JSON imports to reduce copy/paste errors and speed up data shaping.",
          "Output tuned for presentations and reports with clear legends and labels.",
        ],
      },
      {
        title: "When to Use",
        bullets: [
          "Pie/Bar/Line/Area for comparisons, trends, and part-to-whole storytelling.",
          "Scatter for correlation checks; Sunburst for hierarchies; USA Map for geo reporting.",
          "Gantt for project timelines, dependencies, and resource views.",
          "Use when you need exportable visuals quickly without standing up BI tooling.",
        ],
      },
      {
        title: "How to Choose the Right Chart",
        bullets: [
          "Use bar for category comparisons; line/area for time series; pie only for a few slices.",
          "Scatter if you need to see relationships between two variables; add trendlines sparingly.",
          "Sunburst for hierarchical drill-down; map for region-specific summaries.",
          "Gantt when sequencing and durations matter; avoid pies for timelines.",
        ],
      },
      {
        title: "Tips for Better Results",
        bullets: [
          "Limit colors and label clutter—aim for readability on mobile and slides.",
          "Sort categories logically (by value or name) to reduce cognitive load.",
          "Include units and time zones in tooltips or labels to avoid confusion.",
          "Export and test in your slide deck or doc to confirm sizing and legibility.",
        ],
      },
      {
        title: "Common Mistakes to Avoid",
        bullets: [
          "Using pies with too many slices; switch to bar/column when categories exceed a handful.",
          "Skipping units and time zones, which makes values ambiguous; label axes and tooltips clearly.",
          "Choosing the wrong chart type (e.g., line for categorical data); match type to data shape.",
          "Leaving categories unsorted, making comparisons harder; sort by value or alphabetically.",
          "Overloading charts with effects or colors that reduce clarity on mobile or projectors.",
        ],
      },
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
