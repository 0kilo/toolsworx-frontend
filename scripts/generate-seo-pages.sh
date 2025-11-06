#!/bin/bash

# Generate SEO-optimized pages for all converters
# This script creates individual metadata files for each converter

echo "🚀 Generating SEO pages for all converters..."

# Create metadata files for unit conversions
echo "📏 Creating unit conversion metadata..."
mkdir -p app/unit-conversions/length
mkdir -p app/unit-conversions/mass
mkdir -p app/unit-conversions/volume

# Create metadata files for media converters
echo "🎬 Creating media converter metadata..."
mkdir -p app/media-converters/audio
mkdir -p app/media-converters/video

# Create metadata files for file converters
echo "📄 Creating file converter metadata..."
mkdir -p app/file-converters/documents
mkdir -p app/file-converters/spreadsheet
mkdir -p app/file-converters/data

# Create metadata files for calculators
echo "🧮 Creating calculator metadata..."
mkdir -p app/calculators/scientific
mkdir -p app/calculators/bmi
mkdir -p app/calculators/loan

echo "✅ SEO page structure created!"
echo "📝 Next steps:"
echo "1. Add metadata.ts files to each converter directory"
echo "2. Split page.tsx into page.tsx + client.tsx for each converter"
echo "3. Add structured data to each page"
echo "4. Test with npm run build"