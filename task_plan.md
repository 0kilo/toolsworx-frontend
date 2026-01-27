# Task Plan: Firebase Auth UI + API Key Management

## Goal
Add Firebase Auth (Google/GitHub) to the frontend with an authenticated API key management page (create/delete/list) backed by Firestore, and update MCP auth to use hashed API keys.

## Phases
- [x] Phase 1: Plan and setup
- [x] Phase 2: Research/gather information
- [x] Phase 3: Execute/build
- [x] Phase 4: Review and deliver

## Key Questions
1. How should API keys be generated and stored (publicId + hash)?
2. Which pages/components should host FirebaseUI and the API key manager?

## Decisions Made
- Use Firestore `apiKeys` collection with doc ID = publicId.
- Store hashed secret; show raw key only once on creation.

## Errors Encountered
- None.

## Status
**Status:** Complete. Auth UI + API key management implemented with Firebase Auth + Firestore.
