# API Key Schema

This project uses Firestore to store API keys and metadata. Keys are generated as `twx_<env>_<publicId>.<secret>` where only the hashed secret is stored.

## Collection: `apiKeys`
Document ID: `publicId` (short, non-secret identifier).

Required fields:
- `userId` (string): Firebase Auth UID.
- `secretHash` (string): SHA-256 (hex) of the secret (or bcrypt if preferred).
- `active` (boolean): `true` if key is enabled.
- `createdAt` (timestamp): Server time of creation.

Recommended fields:
- `name` (string): User-supplied label (e.g., “CLI”, “MCP dev”).
- `lastUsedAt` (timestamp): Updated on use.
- `scopes` (array<string>): Optional scopes (`mcp:convert`, `mcp:read`).
- `keyPreview` (string): Redacted preview (e.g., `twx_live_ab12...q9k`).
- `rateLimit` (map): Optional per-key overrides, e.g. `{ limit: 1000, windowSeconds: 86400 }`.

## Collection: `apiKeyUsage` (optional)
Document ID: `<publicId>_<YYYYMMDD>`
- `publicId` (string)
- `date` (string)
- `count` (number)
- `lastSeenAt` (timestamp)

Notes
- The raw secret is shown only once at creation. Store only `secretHash`.
- Lookup flow: split key → fetch `apiKeys/<publicId>` → hash secret → compare.
