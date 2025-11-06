#!/bin/bash
cd backend
docker compose build media-conversion
docker compose up -d media-conversion
echo "Media conversion service rebuilt and restarted"