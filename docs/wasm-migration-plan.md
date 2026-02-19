# WASM Migration Plan (Next.js + Firebase App Hosting)

## Goal

Reduce backend cost by moving suitable conversions to browser-side WASM, while keeping UX reliable on low-end devices.

## Recommendation

- **Phase 1 (recommended now):** FFmpeg WASM for selected media conversions.
- **Phase 2 (optional, experimental):** LibreOffice/ZetaJS for narrow document flows only (not full replacement initially).

## Why this approach

- FFmpeg WASM is proven for client-side media transforms and can remove many backend calls.
- LibreOffice-class WASM is much heavier; startup time, memory, and browser compatibility need careful rollout.
- Firebase App Hosting + CDN works well for static WASM assets if loaded lazily and cached aggressively.

## ZetaJS findings (quick review)

- `allotropia/zetajs` is a JS wrapper for ZetaOffice (LibreOffice technology in browser).
- Includes examples for in-browser editing and a `convertpdf` style demo.
- Supports CDN-hosted binaries and self-hosted builds; cross-origin hosting needs proper CORS.
- This makes ZetaJS viable for experiments, but likely too heavy for broad default usage without gating.

## Architecture (target)

1. **Feature flags**
   - `NEXT_PUBLIC_WASM_FFMPEG_ENABLED=true`
   - `NEXT_PUBLIC_WASM_OFFICE_ENABLED=false` (start disabled)

### Current implementation in this repo

- Strategy layer: `lib/services/media-conversion.ts`
- Converter components now use the strategy layer, not direct backend calls:
  - `components/shared/audio-converter.tsx`
  - `components/shared/image-converter.tsx`
  - `components/shared/video-converter.tsx`
- Runtime toggle (no code changes required):
  - `NEXT_PUBLIC_MEDIA_CONVERSION_STRATEGY=ffmpeg-wasm|disabled`
  - `NEXT_PUBLIC_MEDIA_WASM_MAX_MB=40` (browser conversion size cap)
  - `NEXT_PUBLIC_FFMPEG_CORE_PATH=https://.../ffmpeg-core.js`
  - `NEXT_PUBLIC_FFMPEG_WASM_PATH=https://.../ffmpeg-core.wasm`

2. **Client execution model**
   - Run converters in Web Workers.
   - Lazy-load WASM only when user opens a matching tool.
   - Keep existing server API code paths as fallback.

3. **Asset strategy**
   - Host `.wasm`/worker assets under `public/wasm/...`.
   - Add long cache headers for versioned asset paths.
   - Pin exact package/binary versions.

4. **Guardrails**
   - File-size and duration caps (example: 25–50 MB for media in browser).
   - Browser capability checks (memory, worker support).
   - Friendly fallback to “currently unavailable / try smaller file”.

## Phase 1: FFmpeg WASM rollout

### Scope

- Re-enable a subset first:
  - image format conversion (small/medium files)
  - audio format conversion (short clips)
  - simple video transcode presets (short clips only)

### Steps

1. Create `lib/wasm/ffmpeg-client.ts` wrapper (load, run command, progress).
2. Move current media converter components to a strategy:
   - `wasm` path when enabled and file within limits
   - fallback path otherwise
3. Add UI:
   - “Running in browser” indicator
   - estimated limits + progress
4. Instrument:
   - success/fail rate
   - processing time
   - average file size
5. Expand supported presets after stability.

## Phase 2: ZetaJS/LibreOffice experiment

### Scope

- Pilot only one document flow (example: DOCX/ODT -> PDF preview/export).
- Keep this behind explicit “Beta” toggle.

### Steps

1. Build a dedicated prototype page (not main converter path).
2. Measure:
   - initial load time
   - memory usage
   - conversion reliability by browser/device
3. Define go/no-go threshold before production rollout.

## Risks & mitigations

- **Large WASM payloads:** lazy-load + cache + versioned assets.
- **Mobile memory pressure:** strict file caps + graceful fallback.
- **Browser variance:** capability detection + beta-gated rollout.
- **Support burden:** start with narrow presets and clear user messaging.

## Success criteria

- 70%+ of targeted media jobs complete client-side.
- p95 conversion completion under acceptable UX threshold for capped file sizes.
- Meaningful drop in backend conversion traffic/cost.
- No increase in major user-facing errors.

## Implementation order for this repo

1. Add feature flags + shared WASM capability utility.
2. Implement FFmpeg WASM for one tool first (`/media-converters/audio` or `/media-converters/image`).
3. Add telemetry and limits.
4. Expand tool coverage.
5. Run separate ZetaJS pilot page before any global doc-conversion switch.

## References

- ZetaJS GitHub: https://github.com/allotropia/zetajs
- ZetaOffice site/demos: https://zetaoffice.net
- npm package: https://www.npmjs.com/package/zetajs
