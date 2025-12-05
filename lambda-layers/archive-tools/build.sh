#!/bin/bash

# Build archive tools layer
docker build -t archive-tools-layer .
docker run --rm -v $(pwd):/output archive-tools-layer cp /tmp/archive-tools-layer.zip /output/

echo "Archive tools layer built: archive-tools-layer.zip"