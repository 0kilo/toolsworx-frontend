FROM node:20-alpine

# Install FFmpeg, HandBrake, SoX, and dependencies
RUN apk add --no-cache \
    ffmpeg \
    sox \
    curl

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Create temp directory
RUN mkdir -p /tmp/media-processing && \
    chmod 777 /tmp/media-processing

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=15s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3001}/health || exit 1

USER node

CMD ["node", "dist/index.js"]
