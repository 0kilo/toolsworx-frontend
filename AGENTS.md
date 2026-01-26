# Repository Guidelines

## Project Structure & Module Organization
- Next.js 16 App Router lives in `app/`; route segments use folder names (e.g., `app/contact/page.tsx`), with shared layout in `app/layout.tsx` and styles in `app/globals.css`.
- Reusable UI, ads, and converter blocks sit under `components/`; prefer feature folders (e.g., `components/converters/`).
- Business logic and registries (converter definitions, utilities) are in `lib/`; shared types live in `types/`.
- Site config and metadata are in `config/`; static assets belong in `public/`.
- Infrastructure and deployment assets: `amplify/`, `terraform/`, `lambda-layers/`. Sample data files for manual testing are in `tests/docs/`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start the local server.
- `npm run lint` — Next.js/ESLint lint pass; run before commits.
- `npm run build` — production build (runs `prebuild` copy step); fails fast on type or lint errors.
- `npm run start` — serve the built app locally.

## Coding Style & Naming Conventions
- TypeScript-first, functional React components. Use PascalCase for component files, camelCase for functions/variables, and kebab-case for route folders/URLs.
- Let Prettier and ESLint shape formatting (2-space indent, single quotes allowed but stay consistent with existing files). Avoid adding `any`; prefer typed props and utility helpers in `lib/`.
- Tailwind CSS is the styling default; group classes logically (layout → spacing → color) and avoid inline styles unless necessary.

## Testing Guidelines
- No default automated suite yet; at minimum run `npm run lint` and `npm run build` before PRs.
- Manual QA: exercise affected converters, navigation, and SEO metadata (titles/descriptions). Use `tests/docs` fixtures for upload/convert flows.
- If you add automated tests, place them in `tests/` or alongside features with `*.test.ts[x]` naming; prefer lightweight Jest + React Testing Library when introduced.

## Commit & Pull Request Guidelines
- Follow the existing concise, imperative commit style seen in history (e.g., `seo`, `json enhance`). Group related changes per commit.
- Branch names: `feature/<topic>` or `fix/<issue>`.
- PRs should include: what/why summary, commands run (lint/build), screenshots for UI changes, linked issues/tasks, and any config/env updates required.

## Security & Configuration Tips
- Keep secrets out of git; use `.env.local` and never commit keys from Firebase, AWS, or analytics.
- Update `config/site.ts` when adding new converters or changing branding/SEO defaults; ensure matching metadata on new pages.
- Store large static assets in `public/` rather than embedding binaries in code.
