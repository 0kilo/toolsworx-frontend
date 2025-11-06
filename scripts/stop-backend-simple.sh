#!/bin/bash

echo "🛑 Stopping TOOLS WORX backend services..."

# Kill services using saved PIDs
if [ -f /tmp/file-service.pid ]; then
    kill $(cat /tmp/file-service.pid) 2>/dev/null
    rm /tmp/file-service.pid
    echo "✅ File Conversion Service stopped"
fi

if [ -f /tmp/media-service.pid ]; then
    kill $(cat /tmp/media-service.pid) 2>/dev/null
    rm /tmp/media-service.pid
    echo "✅ Media Conversion Service stopped"
fi

if [ -f /tmp/filter-service.pid ]; then
    kill $(cat /tmp/filter-service.pid) 2>/dev/null
    rm /tmp/filter-service.pid
    echo "✅ Filter Service stopped"
fi

# Also kill any remaining node processes on these ports
pkill -f "simple-server.js" 2>/dev/null

echo "🏁 All backend services stopped"