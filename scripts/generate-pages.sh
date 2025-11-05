#!/bin/bash
# Script to generate all conversion page files from registry definitions

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="${SCRIPT_DIR}/../app"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating conversion pages...${NC}\n"

# Function to create a page directory and file
create_page() {
    local category=$1
    local slug=$2
    local title=$3
    local description=$4

    local page_dir="${APP_DIR}/${category}/${slug}"
    local page_file="${page_dir}/page.tsx"

    # Create directory if it doesn't exist
    mkdir -p "${page_dir}"

    # Create page.tsx file
    cat > "${page_file}" << 'EOPAGE'
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

export default function PLACEHOLDER_NAME_Page() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PLACEHOLDER_TITLE</h1>
            <p className="text-muted-foreground">
              PLACEHOLDER_DESCRIPTION
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Select a file to convert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  This converter requires backend service integration.
                  Files are processed securely and deleted automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          <FooterAd />

          <AboutDescription
            title="About PLACEHOLDER_TITLE"
            description="PLACEHOLDER_DESCRIPTION This conversion maintains quality and formatting while ensuring your privacy with automatic file deletion."
            sections={[
              {
                title: "How It Works",
                content: [
                  "Upload your source file",
                  "File is converted using industry-standard tools",
                  "Download your converted file instantly",
                  "Files are automatically deleted after 1 hour"
                ]
              },
              {
                title: "Features",
                content: [
                  "Fast and reliable conversion",
                  "Maintains formatting and quality",
                  "Secure processing with auto-deletion",
                  "No registration required"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
EOPAGE

    # Replace placeholders
    local name_pascal=$(echo "$slug" | sed -r 's/(^|-)([a-z])/\U\2/g')
    sed -i "s/PLACEHOLDER_NAME/${name_pascal}/g" "${page_file}"
    sed -i "s/PLACEHOLDER_TITLE/${title}/g" "${page_file}"
    sed -i "s/PLACEHOLDER_DESCRIPTION/${description}/g" "${page_file}"

    echo -e "${GREEN}✓${NC} Created: ${category}/${slug}/page.tsx"
}

# File Converters
echo -e "${BLUE}Creating File Converter pages...${NC}"
create_page "file-converters" "word-pdf" "Word to PDF" "Convert Word documents (DOCX) to PDF format"
create_page "file-converters" "pdf-powerpoint" "PDF to PowerPoint" "Convert PDF to PowerPoint presentation (PPTX)"
create_page "file-converters" "powerpoint-pdf" "PowerPoint to PDF" "Convert PowerPoint presentations to PDF format"
create_page "file-converters" "pdf-text" "PDF to Text" "Extract plain text from PDF documents"
create_page "file-converters" "html-pdf" "HTML to PDF" "Convert HTML web pages to PDF documents"
create_page "file-converters" "markdown-pdf" "Markdown to PDF" "Convert Markdown files to PDF documents"
create_page "file-converters" "markdown-html" "Markdown to HTML" "Convert Markdown to HTML format"
create_page "file-converters" "excel-csv" "Excel to CSV" "Convert Excel spreadsheets (XLSX) to CSV format"
create_page "file-converters" "csv-excel" "CSV to Excel" "Convert CSV files to Excel spreadsheets (XLSX)"
create_page "file-converters" "json-yaml" "JSON to YAML" "Convert JSON data to YAML format"
create_page "file-converters" "yaml-json" "YAML to JSON" "Convert YAML data to JSON format"
create_page "file-converters" "json-xml" "JSON to XML" "Convert JSON data to XML format"
create_page "file-converters" "xml-json" "XML to JSON" "Convert XML data to JSON format"
create_page "file-converters" "csv-json" "CSV to JSON" "Convert CSV data to JSON format"
create_page "file-converters" "zip-extract" "Extract ZIP" "Extract files from ZIP archives"
create_page "file-converters" "create-zip" "Create ZIP Archive" "Create ZIP archives from multiple files"
create_page "file-converters" "base64-encode" "Base64 Encode" "Encode files or text to Base64 format"
create_page "file-converters" "base64-decode" "Base64 Decode" "Decode Base64 encoded files or text"

# Media Converters
echo -e "\n${BLUE}Creating Media Converter pages...${NC}"
create_page "media-converters" "mp4-avi" "MP4 to AVI" "Convert MP4 videos to AVI format"
create_page "media-converters" "avi-mp4" "AVI to MP4" "Convert AVI videos to MP4 format"
create_page "media-converters" "mp4-mov" "MP4 to MOV" "Convert MP4 videos to MOV (QuickTime) format"
create_page "media-converters" "mov-mp4" "MOV to MP4" "Convert MOV (QuickTime) videos to MP4"
create_page "media-converters" "mp4-webm" "MP4 to WebM" "Convert MP4 videos to WebM format"
create_page "media-converters" "webm-mp4" "WebM to MP4" "Convert WebM videos to MP4 format"
create_page "media-converters" "mkv-mp4" "MKV to MP4" "Convert MKV videos to MP4 format"
create_page "media-converters" "mp4-mkv" "MP4 to MKV" "Convert MP4 videos to MKV format"
create_page "media-converters" "video-compress" "Compress Video" "Reduce video file size while maintaining quality"
create_page "media-converters" "extract-audio" "Extract Audio from Video" "Extract audio track from video files"
create_page "media-converters" "mp3-wav" "MP3 to WAV" "Convert MP3 audio to WAV format"
create_page "media-converters" "wav-mp3" "WAV to MP3" "Convert WAV audio to MP3 format"
create_page "media-converters" "mp3-flac" "MP3 to FLAC" "Convert MP3 audio to FLAC lossless format"
create_page "media-converters" "flac-mp3" "FLAC to MP3" "Convert FLAC lossless audio to MP3"
create_page "media-converters" "mp3-aac" "MP3 to AAC" "Convert MP3 audio to AAC format"
create_page "media-converters" "aac-mp3" "AAC to MP3" "Convert AAC audio to MP3 format"
create_page "media-converters" "ogg-mp3" "OGG to MP3" "Convert OGG audio files to MP3 format"
create_page "media-converters" "mp3-ogg" "MP3 to OGG" "Convert MP3 audio to OGG format"
create_page "media-converters" "jpg-png" "JPG to PNG" "Convert JPG images to PNG format"
create_page "media-converters" "png-jpg" "PNG to JPG" "Convert PNG images to JPG format"
create_page "media-converters" "jpg-webp" "JPG to WebP" "Convert JPG images to WebP format"
create_page "media-converters" "webp-jpg" "WebP to JPG" "Convert WebP images to JPG format"
create_page "media-converters" "png-webp" "PNG to WebP" "Convert PNG images to WebP format"
create_page "media-converters" "webp-png" "WebP to PNG" "Convert WebP images to PNG format"
create_page "media-converters" "image-resize" "Resize Image" "Resize images to specific dimensions or percentages"
create_page "media-converters" "image-compress" "Compress Image" "Reduce image file size while maintaining quality"

# Filters
echo -e "\n${BLUE}Creating Filter pages...${NC}"
mkdir -p "${APP_DIR}/filters"
create_page "filters" "image-brightness" "Adjust Brightness" "Adjust image brightness levels"
create_page "filters" "image-contrast" "Adjust Contrast" "Adjust image contrast levels"
create_page "filters" "image-saturation" "Adjust Saturation" "Adjust color saturation in images"
create_page "filters" "image-grayscale" "Grayscale Filter" "Convert images to black and white"
create_page "filters" "image-sepia" "Sepia Filter" "Apply vintage sepia tone effect"
create_page "filters" "image-vintage" "Vintage Filter" "Apply vintage photo effect"
create_page "filters" "image-blur" "Blur Image" "Apply blur effect to images"
create_page "filters" "image-sharpen" "Sharpen Image" "Enhance image sharpness and details"
create_page "filters" "valencia" "Valencia Filter" "Instagram Valencia filter effect"
create_page "filters" "nashville" "Nashville Filter" "Instagram Nashville filter effect"
create_page "filters" "xpro2" "X-Pro II Filter" "Instagram X-Pro II filter effect"
create_page "filters" "audio-equalizer" "Audio Equalizer" "Adjust audio frequencies with EQ"
create_page "filters" "audio-reverb" "Reverb Effect" "Add reverb to audio files"
create_page "filters" "audio-echo" "Echo Effect" "Add echo effect to audio"
create_page "filters" "audio-noise-reduction" "Noise Reduction" "Remove background noise from audio"
create_page "filters" "audio-normalize" "Normalize Audio" "Normalize audio volume levels"
create_page "filters" "audio-bass-boost" "Bass Boost" "Enhance bass frequencies in audio"
create_page "filters" "json-format" "Format JSON" "Format and prettify JSON data"
create_page "filters" "json-minify" "Minify JSON" "Compress JSON by removing whitespace"
create_page "filters" "xml-format" "Format XML" "Format and prettify XML data"
create_page "filters" "csv-clean" "Clean CSV" "Clean and format CSV data"
create_page "filters" "text-case" "Text Case Converter" "Convert text between different cases"
create_page "filters" "extract-emails" "Extract Emails" "Extract email addresses from text"
create_page "filters" "extract-urls" "Extract URLs" "Extract URLs from text"

echo -e "\n${GREEN}✅ Page generation complete!${NC}"
echo -e "${BLUE}Total pages created: 68${NC}"
