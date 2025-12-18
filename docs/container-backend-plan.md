# Container Backend Plan (Audio Filter, File/Media Conversion, Rates Fetcher)

## Goal
Ship a single containerized backend (ECS/Fargate or similar) that exposes:
- File conversion (doc/sheet/archive) with LibreOffice + archive tools
- Media conversion (existing logic)
- Audio filter (existing logic)
- Rates fetcher (currency/crypto) API
with built-in auth/rate limiting, no Amplify/Lambda dependencies.

## Architecture
- Base: Amazon Linux 2 or Debian/Ubuntu container.
- Runtime: Node 20 (match existing handlers).
- Dependencies baked in:
  - LibreOffice headless for doc conversions
  - p7zip/zip/tar/bzip2
  - ffmpeg/ffprobe (if media conversion needs it)
  - Any existing NPM deps from current handlers
- API: Fastify/Express with endpoints mapping 1:1 to current Lambda handlers.
- Auth: Bearer JWT (Cognito or other) plus optional per-user API key; rate limiting per token.
- Deployment: ECS/Fargate (preferred) with ALB; option to front with API Gateway for throttling.
- Storage: In-memory processing; signed download URLs optional (S3 pre-signed) if you want to avoid data URIs.

## Endpoints (proposed)
- `POST /convert/file` — body: { file (base64 or multipart), fileName, targetFormat, options }
- `POST /convert/media` — similar payload for media conversion
- `POST /filter/audio` — { file, fileName, filterType, options }
- `POST /filter/file` — { file, fileName, options: { type: filterType, ... } }
- `GET /rates/currency?symbol=USD` — returns latest rate
- `GET /rates/crypto?symbol=BTC` — returns latest price

## Implementation Steps
1) **Extract logic**
   - Reuse existing handlers in `amplify/function/file-conversion`, `media-conversion`, `audio-filter`, `file-filter`, `rates-fetcher`.
   - Wrap handler functions into route handlers (no AppSync event shape).
2) **API server**
   - Fastify/Express app with JSON + multipart support (limit upload size).
   - Validation (zod) for inputs; return structured errors.
3) **Auth & Rate limiting**
   - Validate JWT (Cognito or other) from `Authorization`.
   - Optional API key header for higher limits; store keys in env/DB if needed.
   - Apply per-token rate limits (e.g., 60 req/5m base; stricter for file/media).
4) **Processing**
   - File/media/audio: process in /tmp; enforce max size/type; return data URL or pre-signed S3 link if integrating storage.
   - LibreOffice: invoke `/usr/bin/soffice` headless inside container.
   - ffmpeg: ensure binaries in PATH for media/audio flows.
5) **Dockerfile**
   - Install system deps (LibreOffice headless, p7zip, zip/tar/bzip2, ffmpeg).
   - Copy app code and install NPM deps; run as non-root.
   - Expose port 3000 (or env).
6) **Config**
   - ENV: `JWT_ISSUER`, `JWT_AUDIENCE`, `API_KEYS`, `RATE_LIMIT_*`, `MAX_FILE_BYTES`, `MAX_MEDIA_BYTES`.
   - Optional S3 creds/bucket if you choose signed URLs.
7) **Deploy**
   - Build/push image to ECR.
   - ECS/Fargate service + ALB; HTTPS via ACM; optional API Gateway in front for extra auth/throttle.
8) **Client updates**
   - Point frontend/client to new base URL; remove Amplify client for these flows.

## Notes / Risks
- Lambda layer size limits are avoided; container must be patched regularly for security.
- Watch memory/CPU for LibreOffice/ffmpeg; set Fargate task sizes accordingly.
- If keeping AppSync for rates, stub an internal client; otherwise, move rates fetcher into this service with its own data source (DynamoDB or external API).

## Build & Run (unified-service)
- Base: `backend/unified-service` (now modularized under `src/`).
- Build: `docker build -t unified-service .`
- Run locally: `docker run -p 3010:3010 unified-service`
- Env vars: `PORT`, `REDIS_URL`, `LIBRE_OFFICE_PATH`, `FFMPEG_PATH`, `CORS_ORIGIN`, `API_KEYS` (comma-separated), `CONVERSION_LIMIT_NOAUTH` (default 3 per 24h), size caps (`MAX_FILE_SIZE`, `MAX_MEDIA_SIZE`, `MAX_AUDIO_SIZE`).
- Endpoints: `/api/convert`, `/api/media/convert`, `/api/filter`, `/api/audio/filter`, `/api/rates/currency`, `/api/rates/crypto`, plus status/download per type, health `/health`, metrics `/metrics`.
