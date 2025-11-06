FROM node:20-alpine

# Install image processing dependencies
RUN apk add --no-cache \
    vips-dev \
    python3 \
    make \
    g++ \
    curl

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Create temp directory
RUN mkdir -p /tmp/filter-processing && \
    chmod 777 /tmp/filter-processing

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3002}/health || exit 1

USER node

CMD ["node", "dist/index.js"]
