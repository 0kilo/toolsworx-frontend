FROM node:20-alpine

# Install system dependencies for production conversion tools
# These will be needed when implementing actual conversions
RUN apk add --no-cache \
    curl \
    bash

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create temp directory for uploads
RUN mkdir -p /tmp/uploads && chmod 777 /tmp/uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Run as non-root user
USER node

# Start server
CMD ["node", "server.js"]
