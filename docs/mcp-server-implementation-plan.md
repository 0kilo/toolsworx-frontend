# MCP Server Implementation Plan (Convert-All)

## Goals
- Expose selected tools via Model Context Protocol (MCP) using existing logic in `lib/tools/logic`.
- Support file/Media conversions via existing Amplify-backed client where applicable.
- Add strict auth/rate limiting (unlike the public site) to prevent abuse.
- Keep a small, maintainable code surface in `mcp-server/` with clear error handling and telemetry hooks.

## Scope
- In-scope: unit conversions, calculators, developer utilities, charts (where pure), currency/crypto lookups, and file/media/filter jobs via Amplify client.
- Out-of-scope (initial): heavy/bulk jobs beyond current lambdas, user uploads above current size limits, and blog/resources.

## Architecture
1) **Transport**: Use `@modelcontextprotocol/sdk` server with modules/handlers per capability.
2) **Auth**: Require bearer token on each request (passed via MCP client env/config). Validate against:
   - Static token list (env `MCP_API_KEYS`) or
   - HMAC-signed token with shared secret (env `MCP_HMAC_SECRET`) and short expiry.
3) **Rate limiting**:
   - In-memory bucket (per token) for local/dev.
   - Pluggable Redis/Memcache adapter (optional) controlled by env `RATE_LIMIT_BACKEND`.
   - Defaults: 60 requests/5 minutes per token; stricter for file/media jobs (e.g., 10/5 minutes).
4) **Capabilities mapping**:
   - **Pure functions**: Call `lib/tools/logic/**` directly (unit conversions, calculators, dev-tools, charts basics).
   - **Data lookups**: Use `amplifyApiClient` for currency/crypto rates; ensure auth mode is not `apiKey` but uses MCP bearer token if supported. Otherwise, proxy through a minimal lambda/GQL with server-side credentials.
   - **File/Media/Filters**: Wrap `amplifyApiClient` methods; enforce file size/type guards and stricter rate limits.
5) **Logging/observability**:
   - Structured logs (token hash only, never raw token).
   - Error surfaces with generic messages; detailed errors only in logs.
6) **Configuration** (env-based):
   - `MCP_API_KEYS` (comma-separated) or `MCP_HMAC_SECRET`
   - `RATE_LIMIT_BACKEND` (`memory` default, `redis` optional), `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`
   - `FILE_RATE_LIMIT_MAX`, `FILE_MAX_BYTES`, `ALLOWED_MIME`
   - Amplify/AppSync credentials as currently required by `amplifyApiClient`

## Tasks
1) **Server bootstrap**
   - Implement `src/index.ts` to init MCP server, load env, wire auth middleware and rate limiter.
   - Add health/info endpoints (version, allowed tools).
2) **Auth middleware**
   - Parse bearer token from MCP client metadata/env.
   - Validate Cognito access token for baseline access (public-tier limits).
   - Validate per-user MCP API key (issued post-login) to unlock generous limits; store/verify in Amplify or a secure store. Return 401/403 on failure.
3) **Rate limiter**
   - Token-scoped bucket; default 60 req/5m; stricter buckets for file/media (10 req/5m).
   - Memory adapter first; optional Redis config stub.
   - Tiering: Cognito-only tokens get base limits; valid MCP API key bumps limits.
4) **Tool handlers**
   - Unit conversions: map to `lib/tools/logic/unit-conversions/*`.
   - Calculators: map to `lib/tools/logic/calculators/*`.
   - Dev tools: format/validate/minify via existing logic.
   - Charts: allow lightweight operations only (no heavy rendering).
   - Currency/Crypto: wrap `amplifyApiClient` lookups with validation and safe errors.
   - File/Media/Filters: wrap `amplifyApiClient` job calls with size/type guards, stricter rate limit, and download URL return.
5) **Schemas & validation**
   - Use `zod` for request/response; coerce numbers; validate units/types/lengths.
   - Normalize errors to a consistent MCP error shape.
6) **Config/documentation**
   - Update `mcp-server/README.md` with setup, env vars, auth/rate limit notes, and usage examples.
   - Add sample MCP client config (with bearer token).

## Risks / Decisions
- If Amplify/AppSync requires API key, we must avoid embedding it in the MCP client. Prefer server-side credentials + additional auth gate (bearer token) to avoid exposure.
- Rate limiting in-memory is best-effort; recommend Redis if multi-instance.
- File size/type checks must align with existing lambda limits; otherwise return 413 early.

## Decisions / Inputs (locked in)
- Auth: use Amplify/Cognito; MCP server should validate tokens via Cognito. Add API keys issued post-login for MCP usage (per-user keys with generous limits).
- File size/type limits: mirror current site limits (enforce same caps by default; higher limits for keyed users if desired).
- Currency/Crypto: keep using Amplify-backed paths.
