#!/bin/bash

# Script to add metadata exports to all tool pages
# This adds SEO-optimized metadata to each tool page

echo "Adding metadata to tool pages..."

# Temperature Converter
cat > /tmp/temp-metadata.txt << 'EOF'
import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/metadata-generator'

export const metadata: Metadata = generateToolMetadata({
  title: 'Temperature Converter - Celsius, Fahrenheit, Kelvin',
  description: 'Free temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Accurate temperature conversion calculator.',
  keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'temperature calculator'],
  category: 'unit-conversions/temperature'
})

EOF

echo "Metadata template created. Apply manually to each tool page."
echo "Example metadata added for temperature converter."
