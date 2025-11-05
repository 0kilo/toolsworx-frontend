FROM node:20-alpine

# Install LibreOffice, Pandoc, and dependencies
RUN apk add --no-cache \
    libreoffice \
    pandoc \
    ttf-dejavu \
    fontconfig \
    ttf-liberation \
    curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create temp directory with proper permissions
RUN mkdir -p /tmp/file-conversions && \
    chmod 777 /tmp/file-conversions

# Expose port (AWS EB expects port 8080 by default, but we'll use ENV)
EXPOSE 3000

# Health check for AWS ELB
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Run as node user for security
USER node

# Start the application
CMD ["node", "dist/index.js"]
