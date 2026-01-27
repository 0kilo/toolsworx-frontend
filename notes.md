# Notes: Firebase Auth + API Keys

## Sources

### Source 1: @modelcontextprotocol/sdk (local node_modules)
- URL: node_modules/@modelcontextprotocol/sdk
- Key points:
  - TBD after inspection for HTTP transport setup.

### Source 2: backend/unified-service
- URL: backend/unified-service
- Key points:
  - MCP route uses Firestore for API key validation.
  - Existing MCP auth expects full key as doc ID; needs update for hashed scheme.

### Source 3: docs/api-keys-schema.md
- URL: docs/api-keys-schema.md
- Key points:
  - Key format: `twx_<env>_<publicId>.<secret>`
  - Store doc ID = publicId and `secretHash`.

## Synthesized Findings

### Pending
- Mount auth UI at /account/api-keys with FirebaseUI.
- Use NEXT_PUBLIC_FIREBASE_* env vars for client init.
