# TOOLS WORX - Complete Tools Inventory

## Overview
This document provides a comprehensive inventory of all tools available in TOOLS WORX, including their method signatures, input parameters, and output formats.

## Categories

### 1. Calculators (13 tools)

#### BMI Calculator
- **File Location**: `/app/calculators/bmi/page.tsx`
- **Function**: `calculateBMI(input: BMIInput): BMIOutput`
- **Input**: `{ weight: number, height: number, unit: 'metric' | 'imperial' }`
- **Output**: `{ bmi: number, category: string, healthyRange: string }`

#### Calorie Calculator
- **File Location**: `/app/calculators/calorie/page.tsx`
- **Function**: `calculateCalories(input: CalorieInput): CalorieOutput`
- **Input**: `{ age: number, gender: string, weight: number, height: number, activity: string }`
- **Output**: `{ bmr: number, tdee: number, goals: { lose: number, maintain: number, gain: number } }`

#### Concrete Calculator
- **File Location**: `/app/calculators/concrete/page.tsx`
- **Function**: `calculateConcrete(input: ConcreteInput): ConcreteOutput`
- **Input**: `{ length: number, width: number, depth: number, unit: string }`
- **Output**: `{ volume: number, bags: number, cost: number }`

#### Date Calculator
- **File Location**: `/app/calculators/date-calculator/page.tsx`
- **Function**: `calculateDateDifference(input: DateInput): DateOutput`
- **Input**: `{ startDate: string, endDate: string, operation: string }`
- **Output**: `{ days: number, weeks: number, months: number, years: number }`

#### Flooring Calculator
- **File Location**: `/app/calculators/flooring/page.tsx`
- **Function**: `calculateFlooring(input: FlooringInput): FlooringOutput`
- **Input**: `{ length: number, width: number, wastage: number, unit: string }`
- **Output**: `{ area: number, materials: number, cost: number }`

#### Interest, Loan and Mortgage Calculator
- **File Location**: `/app/calculators/loan/page.tsx`
- **Function**: `calculateLoan(input: LoanInput): LoanOutput`
- **Input**: `{ principal: number, rate: number, term: number, type: string, homePrice?: number, downPayment?: number }`
- **Output**: `{ monthlyPayment: number, totalInterest: number, totalAmount: number, loanAmount?: number }`
- **Note**: Combined loan and mortgage calculations in one tool

#### Paint Calculator
- **File Location**: `/app/calculators/paint/page.tsx`
- **Function**: `calculatePaint(input: PaintInput): PaintOutput`
- **Input**: `{ rooms: Array<{ length: number, width: number, height: number }>, coats: number }`
- **Output**: `{ gallons: number, cost: number, coverage: number }`

#### Percentage Calculator
- **File Location**: `/app/calculators/percentage/page.tsx`
- **Function**: `calculatePercentage(input: PercentageInput): PercentageOutput`
- **Input**: `{ value: number, percentage: number, operation: string }`
- **Output**: `{ result: number, calculation: string }`

#### Pregnancy Calculator
- **File Location**: `/app/calculators/pregnancy/page.tsx`
- **Function**: `calculatePregnancy(input: PregnancyInput): PregnancyOutput`
- **Input**: `{ lastPeriod: string, cycleLength: number }`
- **Output**: `{ dueDate: string, weeksPregnant: number, trimester: number }`

#### Protein Calculator
- **File Location**: `/app/calculators/protein/page.tsx`
- **Function**: `calculateProtein(input: ProteinInput): ProteinOutput`
- **Input**: `{ weight: number, activity: string, goal: string, unit: string }`
- **Output**: `{ dailyProtein: number, perMeal: number, sources: string[] }`

#### Tip Calculator
- **File Location**: `/app/calculators/tip/page.tsx`
- **Function**: `calculateTip(input: TipInput): TipOutput`
- **Input**: `{ billAmount: number, tipPercentage: number, people: number }`
- **Output**: `{ tipAmount: number, totalAmount: number, perPerson: number }`

#### Scientific Calculator
- **File Location**: `/app/calculators/scientific/page.tsx`
- **Function**: Client-side mathematical expression evaluation
- **Input**: Mathematical expressions as strings
- **Output**: Calculated results with step-by-step solutions

#### Graphing Calculator
- **File Location**: `/app/calculators/graphing/page.tsx`
- **Function**: Client-side function plotting and analysis
- **Input**: Mathematical functions (e.g., "sin(x)", "x^2")
- **Output**: Interactive graphs with zoom and analysis tools

### 2. Charts (8 tools)

#### Area Chart
- **File Location**: `/app/charts/area-chart/page.tsx`
- **Function**: `generateAreaChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive area chart visualization

#### Bar Chart
- **File Location**: `/app/charts/bar-chart/page.tsx`
- **Function**: `generateBarChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive bar chart visualization

#### Line Chart
- **File Location**: `/app/charts/line-chart/page.tsx`
- **Function**: `generateLineChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive line chart visualization

#### Pie Chart
- **File Location**: `/app/charts/pie-chart/page.tsx`
- **Function**: `generatePieChart(data: PieData): ChartOutput`
- **Input**: `{ labels: string[], data: number[], colors?: string[] }`
- **Output**: Interactive pie chart visualization

#### Scatter Chart
- **File Location**: `/app/charts/scatter-chart/page.tsx`
- **Function**: `generateScatterChart(data: ScatterData): ChartOutput`
- **Input**: `{ datasets: Array<{ label: string, data: Array<{x: number, y: number}> }> }`
- **Output**: Interactive scatter plot visualization

#### Gantt Chart
- **File Location**: `/app/charts/gantt-chart/page.tsx`
- **Function**: Client-side project timeline visualization
- **Input**: Tasks with start/end dates and dependencies
- **Output**: Interactive Gantt chart for project management

#### Sunburst Chart
- **File Location**: `/app/charts/sunburst-chart/page.tsx`
- **Function**: Client-side hierarchical data visualization
- **Input**: Nested data structure with categories and values
- **Output**: Interactive sunburst chart

#### USA Map
- **File Location**: `/app/charts/usa-map/page.tsx`
- **Function**: Client-side choropleth map visualization
- **Input**: State-level data with values
- **Output**: Interactive USA map with data overlay

### 3. Developer Tools (15 tools)

#### Base64 Encoder/Decoder
- **File Location**: `/app/dev-tools/base64/page.tsx`
- **Function**: `encodeBase64(input: Base64Input): Base64Output`
- **Input**: `{ text: string, operation: 'encode' | 'decode' }`
- **Output**: `{ result: string, isValid: boolean }`

#### CSV Formatter
- **File Location**: `/app/dev-tools/csv-formatter/page.tsx`
- **Function**: `formatCSV(input: CSVInput): CSVOutput`
- **Input**: `{ text: string, delimiter?: string, hasHeaders?: boolean }`
- **Output**: `{ result: string, rows: number, columns: number }`

#### Email Extractor
- **File Location**: `/app/dev-tools/email-extractor/page.tsx`
- **Function**: `extractEmails(input: TextInput): EmailOutput`
- **Input**: `{ text: string }`
- **Output**: `{ emails: string[], count: number }`

#### Hash Generator
- **File Location**: `/app/dev-tools/hash-generator/page.tsx`
- **Function**: `generateHash(input: HashInput): HashOutput`
- **Input**: `{ text: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' }`
- **Output**: `{ hash: string, algorithm: string }`

#### JSON Formatter
- **File Location**: `/app/dev-tools/json-formatter/page.tsx`
- **Function**: `formatJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string, indent?: number }`
- **Output**: `{ result: string, isValid: boolean }`

#### JSON Minifier
- **File Location**: `/app/dev-tools/json-minifier/page.tsx`
- **Function**: `minifyJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string }`
- **Output**: `{ result: string, isValid: boolean }`

#### JSON Validator
- **File Location**: `/app/dev-tools/json-validator/page.tsx`
- **Function**: `validateJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string }`
- **Output**: `{ result: string, isValid: boolean }`

#### JWT Decoder
- **File Location**: `/app/dev-tools/jwt-decoder/page.tsx`
- **Function**: `decodeJWT(input: JWTInput): JWTOutput`
- **Input**: `{ token: string }`
- **Output**: `{ header: object, payload: object, signature: string, isValid: boolean }`

#### Regex Tester
- **File Location**: `/app/dev-tools/regex-tester/page.tsx`
- **Function**: `testRegex(input: RegexInput): RegexOutput`
- **Input**: `{ pattern: string, text: string, flags?: string }`
- **Output**: `{ matches: string[], isValid: boolean, matchCount: number }`

#### Text Case Converter
- **File Location**: `/app/dev-tools/text-case-converter/page.tsx`
- **Function**: `convertTextCase(input: TextCaseInput): TextCaseOutput`
- **Input**: `{ text: string, caseType: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' }`
- **Output**: `{ result: string, originalLength: number }`

#### Timestamp Converter
- **File Location**: `/app/dev-tools/timestamp/page.tsx`
- **Function**: `convertTimestamp(input: TimestampInput): TimestampOutput`
- **Input**: `{ timestamp: string | number, format?: string }`
- **Output**: `{ unix: number, iso: string, formatted: string }`

#### URL Encoder/Decoder
- **File Location**: `/app/dev-tools/url-encoder/page.tsx`
- **Function**: `encodeURL(input: URLInput): URLOutput`
- **Input**: `{ text: string, operation: 'encode' | 'decode' }`
- **Output**: `{ result: string, isValid: boolean }`

#### URL Extractor
- **File Location**: `/app/dev-tools/url-extractor/page.tsx`
- **Function**: `extractURLs(input: TextInput): URLOutput`
- **Input**: `{ text: string }`
- **Output**: `{ urls: string[], count: number }`

#### UUID Generator
- **File Location**: `/app/dev-tools/uuid-generator/page.tsx`
- **Function**: `generateUUID(input: UUIDInput): UUIDOutput`
- **Input**: `{ version?: 1 | 4, count?: number }`
- **Output**: `{ uuids: string[], version: number }`

#### XML Formatter
- **File Location**: `/app/dev-tools/xml-formatter/page.tsx`
- **Function**: `formatXML(input: XMLInput): XMLOutput`
- **Input**: `{ text: string, indent?: number }`
- **Output**: `{ result: string, isValid: boolean }`

### 4. File Converters (5 tools)

#### Archive Converter
- **File Location**: `/app/file-converters/archive/page.tsx`
- **Function**: Server-side file compression/extraction
- **Input**: Files for archive creation or archives for extraction (ZIP, RAR, TAR, BZ2, 7Z)
- **Output**: Compressed archives or extracted files with format conversion support

#### Base64 File Converter
- **File Location**: `/app/file-converters/base64/page.tsx`
- **Function**: Server-side file to Base64 conversion
- **Input**: Any file type
- **Output**: Base64 encoded string or decoded file

#### Data Converter
- **File Location**: `/app/file-converters/data/page.tsx`
- **Function**: Server-side data format conversion
- **Input**: JSON, XML, CSV, YAML files
- **Output**: Converted data in target format

#### Document Converter
- **File Location**: `/app/file-converters/documents/page.tsx`
- **Function**: Server-side document conversion using LibreOffice
- **Input**: PDF, DOC, DOCX, ODT, RTF, TXT files
- **Output**: Converted documents in target format

#### Spreadsheet Converter
- **File Location**: `/app/file-converters/spreadsheet/page.tsx`
- **Function**: Server-side spreadsheet conversion
- **Input**: XLS, XLSX, CSV, ODS files
- **Output**: Converted spreadsheets in target format

### 5. Filters (8 tools)

#### Audio Bass Boost
- **File Location**: `/app/filters/audio-bass-boost/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with bass boost parameters
- **Output**: Enhanced audio with boosted bass frequencies

#### Audio Echo
- **File Location**: `/app/filters/audio-echo/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with echo parameters (delay, decay)
- **Output**: Audio with echo effect applied

#### Audio Equalizer
- **File Location**: `/app/filters/audio-equalizer/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with 10-band EQ settings
- **Output**: Audio with equalization applied

#### Audio Noise Reduction
- **File Location**: `/app/filters/audio-noise-reduction/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files
- **Output**: Audio with noise reduction applied

#### Audio Normalize
- **File Location**: `/app/filters/audio-normalize/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files
- **Output**: Audio with normalized levels

#### Audio Reverb
- **File Location**: `/app/filters/audio-reverb/page.tsx`
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with reverb parameters
- **Output**: Audio with reverb effect applied

#### Image Effects
- **File Location**: `/app/filters/image-effects/page.tsx`
- **Function**: Server-side image processing using Sharp
- **Input**: Images with effect parameters (blur, brightness, contrast, etc.)
- **Output**: Processed images with effects applied

#### Text Processor
- **File Location**: `/app/filters/text-processor/page.tsx`
- **Function**: Client-side text manipulation
- **Input**: Text with processing options
- **Output**: Processed text (word count, character count, formatting)

### 6. Helpful Calculators (6 tools - active)

#### Cheatsheet Builder
- **File Location**: `/app/helpful-calculators/cheatsheet-builder/page.tsx`
- **Function**: Client-side cheatsheet generation
- **Input**: Topics and content structure
- **Output**: Formatted cheatsheet document

#### Crypto Converter
- **File Location**: `/app/helpful-calculators/crypto-converter/page.tsx`
- **Function**: `convertCrypto(input: CryptoInput): CryptoOutput`
- **Input**: `{ amount: number, fromCurrency: string, toCurrency: string }`
- **Output**: `{ convertedAmount: number, rate: number, lastUpdated: string }`

#### Holiday Countdown
- **File Location**: `/app/helpful-calculators/holiday-countdown/page.tsx`
- **Function**: `calculateCountdown(input: CountdownInput): CountdownOutput`
- **Input**: `{ targetDate: string, timezone?: string }`
- **Output**: `{ days: number, hours: number, minutes: number, seconds: number }`

#### Password Generator
- **File Location**: `/app/helpful-calculators/password-generator/page.tsx`
- **Function**: `generatePassword(input: PasswordInput): PasswordOutput`
- **Input**: `{ length: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean }`
- **Output**: `{ password: string, strength: string, entropy: number }`

#### Recipe Scaler
- **File Location**: `/app/helpful-calculators/recipe-scaler/page.tsx`
- **Function**: `scaleRecipe(input: RecipeInput): RecipeOutput`
- **Input**: `{ ingredients: Array<{ name: string, amount: number, unit: string }>, originalServings: number, targetServings: number }`
- **Output**: `{ scaledIngredients: Array<{ name: string, amount: number, unit: string }>, scaleFactor: number }`

#### Secret Santa Generator
- **File Location**: `/app/helpful-calculators/secret-santa/page.tsx`
- **Function**: `generateSecretSanta(input: SecretSantaInput): SecretSantaOutput`
- **Input**: `{ participants: string[], exclusions?: Array<{ giver: string, receiver: string }> }`
- **Output**: `{ assignments: Array<{ giver: string, receiver: string }>, isValid: boolean }`

#### Shipping Cost Calculator
- **File Location**: `/app/helpful-calculators/shipping-cost/page.tsx`
- **Function**: Server-side shipping rate calculation
- **Input**: Package dimensions, weight, origin, destination
- **Output**: Shipping rates from multiple carriers

### 7. Media Converters (3 tools - active)

#### Audio Converter
- **File Location**: `/app/media-converters/audio/page.tsx`
- **Function**: Server-side audio format conversion using FFmpeg
- **Input**: Audio files (MP3, WAV, FLAC, AAC, OGG)
- **Output**: Converted audio in target format

#### Image Converter
- **File Location**: `/app/media-converters/image/page.tsx`
- **Function**: Server-side image format conversion using Sharp
- **Input**: Images (JPG, PNG, WebP, GIF, BMP, TIFF)
- **Output**: Converted images in target format with optional compression

#### Speech to Text
- **File Location**: `/app/media-converters/speech-to-text/page.tsx`
- **Function**: Server-side speech recognition
- **Input**: Audio/video files with speech
- **Output**: Transcribed text with timestamps

#### Video Converter
- **File Location**: `/app/media-converters/video/page.tsx`
- **Function**: Server-side video format conversion using FFmpeg
- **Input**: Video files (MP4, AVI, MKV, MOV, WebM)
- **Output**: Converted videos in target format

### 8. Unit Conversions (12 tools)

#### Area Converter
- **File Location**: `/app/unit-conversions/area/page.tsx`
- **Function**: `convertArea(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Currency Converter
- **File Location**: `/app/unit-conversions/currency/page.tsx`
- **Function**: `convertCurrency(input: CurrencyInput): CurrencyOutput`
- **Input**: `{ amount: number, fromCurrency: string, toCurrency: string }`
- **Output**: `{ convertedAmount: number, rate: number, lastUpdated: string }`

#### Data Converter
- **File Location**: `/app/unit-conversions/data/page.tsx`
- **Function**: `convertData(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Energy Converter
- **File Location**: `/app/unit-conversions/energy/page.tsx`
- **Function**: `convertEnergy(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Length Converter
- **File Location**: `/app/unit-conversions/length/page.tsx`
- **Function**: `convertLength(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Mass Converter
- **File Location**: `/app/unit-conversions/mass/page.tsx`
- **Function**: `convertMass(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Pressure Converter
- **File Location**: `/app/unit-conversions/pressure/page.tsx`
- **Function**: `convertPressure(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Speed Converter
- **File Location**: `/app/unit-conversions/speed/page.tsx`
- **Function**: `convertSpeed(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Temperature Converter
- **File Location**: `/app/unit-conversions/temperature/page.tsx`
- **Function**: `convertTemperature(input: TemperatureInput): TemperatureOutput`
- **Input**: `{ value: number, fromUnit: 'celsius' | 'fahrenheit' | 'kelvin', toUnit: 'celsius' | 'fahrenheit' | 'kelvin' }`
- **Output**: `{ result: number, formula: string }`

#### Time Converter
- **File Location**: `/app/unit-conversions/time/page.tsx`
- **Function**: `convertTime(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Volume Converter
- **File Location**: `/app/unit-conversions/volume/page.tsx`
- **Function**: `convertVolume(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Spacetime Converter
- **File Location**: `/app/unit-conversions/spacetime/page.tsx`
- **Function**: `convertSpacetime(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

## Summary

**Total Tools**: 70 tools across 8 categories (active, in registry)

**By Category:**
- Unit Conversions: 12 tools
- Calculators: 13 tools (includes combined loan/mortgage calculator)
- Charts: 8 tools
- Developer Tools: 15 tools
- Filters: 8 tools (2 unified image/text tools + 6 audio filters)
- File Converters: 5 tools
- Media Converters: 3 tools (speech-to-text excluded - not integrated)
- Helpful Calculators: 6 tools (shipping-cost excluded - API unavailable)

**Additional Pages (not in registry):**
- Speech to Text (not integrated yet)
- Shipping Cost Calculator (USPS API unavailable)

**Total Pages**: 72 tools

**Processing Types**:
- **Client-side**: 54 tools (calculators, charts, dev tools, unit conversions, helpful calculators)
- **Server-side**: 16 tools (file converters, media converters, filters)

**Backend Services**:
- **File Conversion Service**: LibreOffice-based document processing
- **Media Conversion Service**: FFmpeg-based audio/video processing  
- **Filter Service**: Sharp-based image processing and FFmpeg audio effects
- **Rate Limiter**: DynamoDB-based usage tracking (3 uses per tool per day)

**Rate Limiting**: All server-side tools are rate-limited to 3 uses per session per day to manage costs and prevent abuse.