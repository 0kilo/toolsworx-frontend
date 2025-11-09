FROM node:20-alpine

# Install system dependencies for file/media conversions
RUN apk add --no-cache \
    curl \
    bash \
    libreoffice \
    openjdk11-jre \
    ffmpeg \
    python3 \
    py3-pip \
    font-noto \
    font-noto-cjk \
    ttf-dejavu

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Create temp directory for uploads
RUN mkdir -p /tmp/uploads && chmod 777 /tmp/uploads

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3010/health || exit 1

# Run as node user (but keep permissions for LibreOffice)
USER node

# Start server
CMD ["node", "server.js"]
