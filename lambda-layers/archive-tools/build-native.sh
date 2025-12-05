#!/bin/bash

# Create layer structure
mkdir -p opt/bin

# Copy system binaries (if available)
cp /usr/bin/zip opt/bin/ 2>/dev/null || echo "zip not found"
cp /usr/bin/unzip opt/bin/ 2>/dev/null || echo "unzip not found"
cp /usr/bin/tar opt/bin/ 2>/dev/null || echo "tar not found"
cp /usr/bin/bzip2 opt/bin/ 2>/dev/null || echo "bzip2 not found"
cp /usr/bin/7z opt/bin/ 2>/dev/null || echo "7z not found"
cp /usr/bin/unrar opt/bin/ 2>/dev/null || echo "unrar not found"

# Create placeholder if no tools found
if [ ! "$(ls -A opt/bin)" ]; then
    echo "#!/bin/bash" > opt/bin/placeholder
    chmod +x opt/bin/placeholder
fi

# Package layer
zip -r archive-tools-layer.zip opt/

echo "Archive tools layer built: archive-tools-layer.zip"