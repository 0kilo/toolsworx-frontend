FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js 20, LibreOffice, ffmpeg, and tools
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y \
      nodejs \
      libreoffice \
      libreoffice-writer libreoffice-calc \
      p7zip-full \
      ffmpeg \
      fontconfig \
      fonts-dejavu-core \
      fonts-noto \
      fonts-noto-cjk \
      python3 \
      python3-pip \
      unzip zip tar bzip2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p /tmp/uploads && chmod 777 /tmp/uploads

ENV LIBRE_OFFICE_PATH=/usr/bin/libreoffice \
    FFMPEG_PATH=/usr/bin/ffmpeg \
    NODE_ENV=production

EXPOSE 3010

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3010/health || exit 1

CMD ["node", "src/server.js"]
