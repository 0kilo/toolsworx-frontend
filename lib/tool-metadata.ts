// SEO-optimized metadata for all tools
export const toolMetadata = {
  // Unit Conversions
  'temperature': {
    title: 'Temperature Converter - Celsius, Fahrenheit, Kelvin',
    description: 'Free temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Accurate temperature conversion calculator.',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter']
  },
  'length': {
    title: 'Length Converter - Meters, Feet, Inches, Miles',
    description: 'Convert length and distance units. Meters to feet, inches to cm, miles to km. Free online length conversion calculator.',
    keywords: ['length converter', 'meters to feet', 'inches to cm', 'distance converter']
  },
  'mass': {
    title: 'Weight Converter - Kilograms, Pounds, Ounces',
    description: 'Convert weight and mass units. Kg to lbs, pounds to kg, ounces to grams. Free weight conversion calculator.',
    keywords: ['weight converter', 'kg to lbs', 'pounds to kg', 'mass converter']
  },
  'volume': {
    title: 'Volume Converter - Liters, Gallons, Cups',
    description: 'Convert volume units. Liters to gallons, ml to oz, cups to ml. Free volume conversion calculator.',
    keywords: ['volume converter', 'liters to gallons', 'ml to oz', 'cup converter']
  },
  'area': {
    title: 'Area Converter - Square Meters, Feet, Acres',
    description: 'Convert area units. Square meters to feet, acres to hectares, sqft to sqm. Free area conversion calculator.',
    keywords: ['area converter', 'square meters to feet', 'acres to hectares']
  },
  'speed': {
    title: 'Speed Converter - MPH, KPH, Knots',
    description: 'Convert speed units. MPH to KPH, knots to mph, meters per second. Free speed conversion calculator.',
    keywords: ['speed converter', 'mph to kph', 'knots to mph']
  },
  'time': {
    title: 'Time Converter - Hours, Minutes, Seconds',
    description: 'Convert time units. Hours to minutes, seconds to hours, days to weeks. Free time conversion calculator.',
    keywords: ['time converter', 'hours to minutes', 'seconds converter']
  },
  'energy': {
    title: 'Energy Converter - Joules, Calories, BTU',
    description: 'Convert energy units. Joules to calories, BTU to kWh, watts to horsepower. Free energy conversion calculator.',
    keywords: ['energy converter', 'joules to calories', 'btu converter']
  },
  'pressure': {
    title: 'Pressure Converter - PSI, Bar, Pascal',
    description: 'Convert pressure units. PSI to bar, pascal to atm, kPa to psi. Free pressure conversion calculator.',
    keywords: ['pressure converter', 'psi to bar', 'pascal converter']
  },
  'data': {
    title: 'Data Size Converter - MB, GB, TB',
    description: 'Convert data storage units. MB to GB, bytes to KB, TB to GB. Free data size conversion calculator.',
    keywords: ['data converter', 'mb to gb', 'bytes to kb', 'storage converter']
  },
  'currency': {
    title: 'Currency Converter - Live Exchange Rates',
    description: 'Convert currencies with live exchange rates. USD to EUR, GBP to USD, real-time currency conversion.',
    keywords: ['currency converter', 'exchange rate', 'usd to eur', 'forex converter']
  },
  
  // Calculators
  'bmi': {
    title: 'BMI Calculator - Body Mass Index Calculator',
    description: 'Calculate your BMI (Body Mass Index). Free BMI calculator with weight categories and health recommendations.',
    keywords: ['bmi calculator', 'body mass index', 'weight calculator', 'health calculator']
  },
  'percentage': {
    title: 'Percentage Calculator - Calculate Percentages',
    description: 'Calculate percentages, percentage increase, decrease, and change. Free percentage calculator tool.',
    keywords: ['percentage calculator', 'percent calculator', 'percentage change']
  },
  'loan': {
    title: 'Loan Calculator - Monthly Payment Calculator',
    description: 'Calculate loan payments, interest, and amortization. Free loan calculator with payment schedule.',
    keywords: ['loan calculator', 'payment calculator', 'interest calculator']
  },
  'mortgage': {
    title: 'Mortgage Calculator - Home Loan Calculator',
    description: 'Calculate mortgage payments, interest, and affordability. Free mortgage calculator with amortization.',
    keywords: ['mortgage calculator', 'home loan calculator', 'mortgage payment']
  },
  'tip': {
    title: 'Tip Calculator - Calculate Tips and Split Bills',
    description: 'Calculate tips and split bills. Free tip calculator with percentage options and bill splitting.',
    keywords: ['tip calculator', 'gratuity calculator', 'bill splitter']
  },
  
  // Dev Tools
  'json-formatter': {
    title: 'JSON Formatter - Format and Beautify JSON',
    description: 'Format, beautify, and validate JSON online. Free JSON formatter with syntax highlighting.',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'format json']
  },
  'json-minifier': {
    title: 'JSON Minifier - Compress JSON Online',
    description: 'Minify and compress JSON online. Free JSON minifier to reduce file size.',
    keywords: ['json minifier', 'compress json', 'minify json', 'json compressor']
  },
  'base64': {
    title: 'Base64 Encoder/Decoder - Encode and Decode',
    description: 'Encode and decode Base64 online. Free Base64 encoder and decoder tool.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64']
  },
  'uuid-generator': {
    title: 'UUID Generator - Generate Unique IDs',
    description: 'Generate UUIDs (Universally Unique Identifiers) online. Free UUID v4 generator.',
    keywords: ['uuid generator', 'guid generator', 'unique id generator']
  },
  'hash-generator': {
    title: 'Hash Generator - MD5, SHA1, SHA256',
    description: 'Generate cryptographic hashes online. MD5, SHA1, SHA256, SHA512 hash generator.',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'checksum']
  },
}

export type ToolId = keyof typeof toolMetadata
