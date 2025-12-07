# TOOLS WORX - Complete Tools Inventory

## Overview
This document provides a comprehensive inventory of all tools available in TOOLS WORX, including their method signatures, input parameters, and output formats.

## Categories

### 1. Calculators (14 tools)

#### BMI Calculator
- **Function**: `calculateBMI(input: BMIInput): BMIOutput`
- **Input**: `{ weight: number, height: number, unit: 'metric' | 'imperial' }`
- **Output**: `{ bmi: number, category: string, healthyRange: string }`

#### Calorie Calculator
- **Function**: `calculateCalories(input: CalorieInput): CalorieOutput`
- **Input**: `{ age: number, gender: string, weight: number, height: number, activity: string }`
- **Output**: `{ bmr: number, tdee: number, goals: { lose: number, maintain: number, gain: number } }`

#### Concrete Calculator
- **Function**: `calculateConcrete(input: ConcreteInput): ConcreteOutput`
- **Input**: `{ length: number, width: number, depth: number, unit: string }`
- **Output**: `{ volume: number, bags: number, cost: number }`

#### Date Calculator
- **Function**: `calculateDateDifference(input: DateInput): DateOutput`
- **Input**: `{ startDate: string, endDate: string, operation: string }`
- **Output**: `{ days: number, weeks: number, months: number, years: number }`

#### Flooring Calculator
- **Function**: `calculateFlooring(input: FlooringInput): FlooringOutput`
- **Input**: `{ length: number, width: number, wastage: number, unit: string }`
- **Output**: `{ area: number, materials: number, cost: number }`

#### Loan Calculator
- **Function**: `calculateLoan(input: LoanInput): LoanOutput`
- **Input**: `{ principal: number, rate: number, term: number, type: string }`
- **Output**: `{ monthlyPayment: number, totalInterest: number, totalAmount: number }`

#### Mortgage Calculator
- **Function**: `calculateMortgage(input: MortgageInput): MortgageOutput`
- **Input**: `{ homePrice: number, downPayment: number, rate: number, term: number }`
- **Output**: `{ monthlyPayment: number, totalInterest: number, loanAmount: number }`

#### Paint Calculator
- **Function**: `calculatePaint(input: PaintInput): PaintOutput`
- **Input**: `{ rooms: Array<{ length: number, width: number, height: number }>, coats: number }`
- **Output**: `{ gallons: number, cost: number, coverage: number }`

#### Percentage Calculator
- **Function**: `calculatePercentage(input: PercentageInput): PercentageOutput`
- **Input**: `{ value: number, percentage: number, operation: string }`
- **Output**: `{ result: number, calculation: string }`

#### Pregnancy Calculator
- **Function**: `calculatePregnancy(input: PregnancyInput): PregnancyOutput`
- **Input**: `{ lastPeriod: string, cycleLength: number }`
- **Output**: `{ dueDate: string, weeksPregnant: number, trimester: number }`

#### Protein Calculator
- **Function**: `calculateProtein(input: ProteinInput): ProteinOutput`
- **Input**: `{ weight: number, activity: string, goal: string, unit: string }`
- **Output**: `{ dailyProtein: number, perMeal: number, sources: string[] }`

#### Tip Calculator
- **Function**: `calculateTip(input: TipInput): TipOutput`
- **Input**: `{ billAmount: number, tipPercentage: number, people: number }`
- **Output**: `{ tipAmount: number, totalAmount: number, perPerson: number }`

#### Scientific Calculator
- **Function**: Client-side mathematical expression evaluation
- **Input**: Mathematical expressions as strings
- **Output**: Calculated results with step-by-step solutions

#### Graphing Calculator
- **Function**: Client-side function plotting and analysis
- **Input**: Mathematical functions (e.g., "sin(x)", "x^2")
- **Output**: Interactive graphs with zoom and analysis tools

### 2. Charts (9 tools)

#### Area Chart
- **Function**: `generateAreaChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive area chart visualization

#### Bar Chart
- **Function**: `generateBarChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive bar chart visualization

#### Line Chart
- **Function**: `generateLineChart(data: ChartData): ChartOutput`
- **Input**: `{ labels: string[], datasets: Array<{ label: string, data: number[] }> }`
- **Output**: Interactive line chart visualization

#### Pie Chart
- **Function**: `generatePieChart(data: PieData): ChartOutput`
- **Input**: `{ labels: string[], data: number[], colors?: string[] }`
- **Output**: Interactive pie chart visualization

#### Scatter Chart
- **Function**: `generateScatterChart(data: ScatterData): ChartOutput`
- **Input**: `{ datasets: Array<{ label: string, data: Array<{x: number, y: number}> }> }`
- **Output**: Interactive scatter plot visualization

#### Gantt Chart
- **Function**: Client-side project timeline visualization
- **Input**: Tasks with start/end dates and dependencies
- **Output**: Interactive Gantt chart for project management

#### Sunburst Chart
- **Function**: Client-side hierarchical data visualization
- **Input**: Nested data structure with categories and values
- **Output**: Interactive sunburst chart

#### USA Map
- **Function**: Client-side choropleth map visualization
- **Input**: State-level data with values
- **Output**: Interactive USA map with data overlay

### 3. Developer Tools (16 tools)

#### Base64 Encoder/Decoder
- **Function**: `encodeBase64(input: Base64Input): Base64Output`
- **Input**: `{ text: string, operation: 'encode' | 'decode' }`
- **Output**: `{ result: string, isValid: boolean }`

#### CSV Formatter
- **Function**: `formatCSV(input: CSVInput): CSVOutput`
- **Input**: `{ text: string, delimiter?: string, hasHeaders?: boolean }`
- **Output**: `{ result: string, rows: number, columns: number }`

#### Email Extractor
- **Function**: `extractEmails(input: TextInput): EmailOutput`
- **Input**: `{ text: string }`
- **Output**: `{ emails: string[], count: number }`

#### Hash Generator
- **Function**: `generateHash(input: HashInput): HashOutput`
- **Input**: `{ text: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' }`
- **Output**: `{ hash: string, algorithm: string }`

#### JSON Formatter
- **Function**: `formatJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string, indent?: number }`
- **Output**: `{ result: string, isValid: boolean }`

#### JSON Minifier
- **Function**: `minifyJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string }`
- **Output**: `{ result: string, isValid: boolean }`

#### JSON Validator
- **Function**: `validateJSON(input: JSONInput): JSONOutput`
- **Input**: `{ text: string }`
- **Output**: `{ result: string, isValid: boolean }`

#### JWT Decoder
- **Function**: `decodeJWT(input: JWTInput): JWTOutput`
- **Input**: `{ token: string }`
- **Output**: `{ header: object, payload: object, signature: string, isValid: boolean }`

#### Regex Tester
- **Function**: `testRegex(input: RegexInput): RegexOutput`
- **Input**: `{ pattern: string, text: string, flags?: string }`
- **Output**: `{ matches: string[], isValid: boolean, matchCount: number }`

#### Text Case Converter
- **Function**: `convertTextCase(input: TextCaseInput): TextCaseOutput`
- **Input**: `{ text: string, caseType: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' }`
- **Output**: `{ result: string, originalLength: number }`

#### Timestamp Converter
- **Function**: `convertTimestamp(input: TimestampInput): TimestampOutput`
- **Input**: `{ timestamp: string | number, format?: string }`
- **Output**: `{ unix: number, iso: string, formatted: string }`

#### URL Encoder/Decoder
- **Function**: `encodeURL(input: URLInput): URLOutput`
- **Input**: `{ text: string, operation: 'encode' | 'decode' }`
- **Output**: `{ result: string, isValid: boolean }`

#### URL Extractor
- **Function**: `extractURLs(input: TextInput): URLOutput`
- **Input**: `{ text: string }`
- **Output**: `{ urls: string[], count: number }`

#### UUID Generator
- **Function**: `generateUUID(input: UUIDInput): UUIDOutput`
- **Input**: `{ version?: 1 | 4, count?: number }`
- **Output**: `{ uuids: string[], version: number }`

#### XML Formatter
- **Function**: `formatXML(input: XMLInput): XMLOutput`
- **Input**: `{ text: string, indent?: number }`
- **Output**: `{ result: string, isValid: boolean }`

### 4. File Converters (5 tools)

#### Archive Converter
- **Function**: Server-side file compression/extraction
- **Input**: Files for archive creation or archives for extraction (ZIP, RAR, TAR, BZ2, 7Z)
- **Output**: Compressed archives or extracted files with format conversion support

#### Base64 File Converter
- **Function**: Server-side file to Base64 conversion
- **Input**: Any file type
- **Output**: Base64 encoded string or decoded file

#### Data Converter
- **Function**: Server-side data format conversion
- **Input**: JSON, XML, CSV, YAML files
- **Output**: Converted data in target format

#### Document Converter
- **Function**: Server-side document conversion using LibreOffice
- **Input**: PDF, DOC, DOCX, ODT, RTF, TXT files
- **Output**: Converted documents in target format

#### Spreadsheet Converter
- **Function**: Server-side spreadsheet conversion
- **Input**: XLS, XLSX, CSV, ODS files
- **Output**: Converted spreadsheets in target format

### 5. Filters (8 tools)

#### Audio Bass Boost
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with bass boost parameters
- **Output**: Enhanced audio with boosted bass frequencies

#### Audio Echo
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with echo parameters (delay, decay)
- **Output**: Audio with echo effect applied

#### Audio Equalizer
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with 10-band EQ settings
- **Output**: Audio with equalization applied

#### Audio Noise Reduction
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files
- **Output**: Audio with noise reduction applied

#### Audio Normalize
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files
- **Output**: Audio with normalized levels

#### Audio Reverb
- **Function**: Server-side audio processing using FFmpeg
- **Input**: Audio files with reverb parameters
- **Output**: Audio with reverb effect applied

#### Image Effects
- **Function**: Server-side image processing using Sharp
- **Input**: Images with effect parameters (blur, brightness, contrast, etc.)
- **Output**: Processed images with effects applied

#### Text Processor
- **Function**: Client-side text manipulation
- **Input**: Text with processing options
- **Output**: Processed text (word count, character count, formatting)

### 6. Helpful Calculators (7 tools)

#### Cheatsheet Builder
- **Function**: Client-side cheatsheet generation
- **Input**: Topics and content structure
- **Output**: Formatted cheatsheet document

#### Crypto Converter
- **Function**: `convertCrypto(input: CryptoInput): CryptoOutput`
- **Input**: `{ amount: number, fromCurrency: string, toCurrency: string }`
- **Output**: `{ convertedAmount: number, rate: number, lastUpdated: string }`

#### Holiday Countdown
- **Function**: `calculateCountdown(input: CountdownInput): CountdownOutput`
- **Input**: `{ targetDate: string, timezone?: string }`
- **Output**: `{ days: number, hours: number, minutes: number, seconds: number }`

#### Password Generator
- **Function**: `generatePassword(input: PasswordInput): PasswordOutput`
- **Input**: `{ length: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean }`
- **Output**: `{ password: string, strength: string, entropy: number }`

#### Recipe Scaler
- **Function**: `scaleRecipe(input: RecipeInput): RecipeOutput`
- **Input**: `{ ingredients: Array<{ name: string, amount: number, unit: string }>, originalServings: number, targetServings: number }`
- **Output**: `{ scaledIngredients: Array<{ name: string, amount: number, unit: string }>, scaleFactor: number }`

#### Secret Santa Generator
- **Function**: `generateSecretSanta(input: SecretSantaInput): SecretSantaOutput`
- **Input**: `{ participants: string[], exclusions?: Array<{ giver: string, receiver: string }> }`
- **Output**: `{ assignments: Array<{ giver: string, receiver: string }>, isValid: boolean }`

#### Shipping Cost Calculator
- **Function**: Server-side shipping rate calculation
- **Input**: Package dimensions, weight, origin, destination
- **Output**: Shipping rates from multiple carriers

### 7. Media Converters (4 tools)

#### Audio Converter
- **Function**: Server-side audio format conversion using FFmpeg
- **Input**: Audio files (MP3, WAV, FLAC, AAC, OGG)
- **Output**: Converted audio in target format

#### Image Converter
- **Function**: Server-side image format conversion using Sharp
- **Input**: Images (JPG, PNG, WebP, GIF, BMP, TIFF)
- **Output**: Converted images in target format with optional compression

#### Speech to Text
- **Function**: Server-side speech recognition
- **Input**: Audio/video files with speech
- **Output**: Transcribed text with timestamps

#### Video Converter
- **Function**: Server-side video format conversion using FFmpeg
- **Input**: Video files (MP4, AVI, MKV, MOV, WebM)
- **Output**: Converted videos in target format

### 8. Unit Conversions (12 tools)

#### Area Converter
- **Function**: `convertArea(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Currency Converter
- **Function**: `convertCurrency(input: CurrencyInput): CurrencyOutput`
- **Input**: `{ amount: number, fromCurrency: string, toCurrency: string }`
- **Output**: `{ convertedAmount: number, rate: number, lastUpdated: string }`

#### Data Converter
- **Function**: `convertData(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Energy Converter
- **Function**: `convertEnergy(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Length Converter
- **Function**: `convertLength(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Mass Converter
- **Function**: `convertMass(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Pressure Converter
- **Function**: `convertPressure(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Speed Converter
- **Function**: `convertSpeed(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Temperature Converter
- **Function**: `convertTemperature(input: TemperatureInput): TemperatureOutput`
- **Input**: `{ value: number, fromUnit: 'celsius' | 'fahrenheit' | 'kelvin', toUnit: 'celsius' | 'fahrenheit' | 'kelvin' }`
- **Output**: `{ result: number, formula: string }`

#### Time Converter
- **Function**: `convertTime(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Volume Converter
- **Function**: `convertVolume(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

#### Spacetime Converter
- **Function**: `convertSpacetime(input: ConversionInput): ConversionOutput`
- **Input**: `{ value: number, fromUnit: string, toUnit: string }`
- **Output**: `{ result: number, formula: string }`

## Summary

**Total Tools**: 75 tools across 8 categories
- Calculators: 14 tools
- Charts: 9 tools
- Developer Tools: 16 tools
- File Converters: 5 tools
- Filters: 8 tools
- Helpful Calculators: 7 tools
- Media Converters: 4 tools
- Unit Conversions: 12 tools

**Processing Types**:
- **Client-side**: 58 tools (calculators, charts, dev tools, unit conversions, helpful calculators)
- **Server-side**: 17 tools (file converters, media converters, filters)

**Backend Services**:
- **File Conversion Service**: LibreOffice-based document processing
- **Media Conversion Service**: FFmpeg-based audio/video processing  
- **Filter Service**: Sharp-based image processing and FFmpeg audio effects
- **Rate Limiter**: DynamoDB-based usage tracking (3 uses per tool per day)

**Rate Limiting**: All server-side tools are rate-limited to 3 uses per session per day to manage costs and prevent abuse.