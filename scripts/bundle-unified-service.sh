#!/usr/bin/env bash
set -euo pipefail

# Bundles backend/unified-service into a zip for Elastic Beanstalk deployment.
# Usage: scripts/bundle-unified-service.sh [output-zip]

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE_DIR="$ROOT_DIR/backend/unified-service"
OUTPUT_ZIP="${1:-$ROOT_DIR/backend/unified-bundle.zip}"

if [[ ! -d "$SERVICE_DIR" ]]; then
  echo "Service directory not found: $SERVICE_DIR" >&2
  exit 1
fi

cd "$SERVICE_DIR"

echo "Creating bundle from $(pwd) -> $OUTPUT_ZIP"
zip -r "$OUTPUT_ZIP" . -x "*.git*" "node_modules/*" "*.DS_Store" >/dev/null

echo "Bundle created at $OUTPUT_ZIP"
