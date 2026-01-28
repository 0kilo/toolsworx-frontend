# Anonymous 3-per-24h Rate Limiting Plan

## Goal
Allow anonymous users to run file + media conversions without login, capped at **3 conversions per 24 hours**. Authenticated users will use Firebase Auth (UID) and can have higher limits later.

## Constraints
- Backend is public (Cloud Run).
- We cannot truly restrict requests to the frontend only.
- Must deter abuse while keeping UX low-friction.

## Approach (Server-Enforced)
1. **Fingerprint key** for anonymous requests:
   - Hash of `IP + user-agent + day-bucket`.
   - IP from `X-Forwarded-For` (trust proxy enabled).
   - Use SHA-256 and store only the hash.
2. **Firestore-backed counters**:
   - Collection: `conversionLimits`.
   - Document ID: `anon_<hash>` for anonymous, `user_<uid>` for authenticated.
   - Fields: `count`, `resetAt`, `updatedAt`, `type`, `ipHash` (optional).
   - TTL configured on `resetAt` so records auto-expire.
3. **Limit logic**:
   - If `count >= 3` and `resetAt > now`, block with 429 + time-until-reset.
   - Otherwise increment atomically and allow.
4. **Optional anti-abuse (recommended)**:
   - Add Turnstile/ReCAPTCHA token from frontend.
   - Backend verifies token before incrementing.

## Where to Implement
- Backend: `backend/unified-service/src/rateLimitFirestore.js`
- Middleware before conversion endpoints (`/api/file/convert`, `/api/media/convert`).
- Reuse for MCP endpoints (with API key mapped to user or key ID).

## Response Contract
- On limit exceeded: `429` with JSON
  ```json
  {
    "success": false,
    "error": "Daily limit reached",
    "limit": 3,
    "resetAt": "2026-01-29T00:00:00.000Z"
  }
  ```

## Future (Authenticated)
- If Firebase Auth token present, use `uid` as the limit key.
- Store per-user limits in `apiKeys` or `users` to allow higher quotas.

## Notes
- This is enforceable server-side and does not require authentication.
- VPC egress configuration does not restrict public access.
