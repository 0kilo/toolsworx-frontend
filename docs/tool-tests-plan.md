# Tool Unit Test Plan

## Goal
Create one unit test file per tool, grouped by category under `tests/`, using existing fixtures in `tests/docs/` and adding minimal media fixtures where needed. Tests should confirm each tool’s core behavior (conversion/output shape) and align with existing tool routes/endpoints.

## Assumptions
- Tests will target the unified-service API endpoints (`/api/convert`, `/api/media/convert`, `/api/filters/...`) to validate real conversions, not just pure utility logic.
- If a future unit-test framework is introduced (Jest or Vitest), these files should follow `*.test.js` naming and be run via a dedicated script (e.g., `npm run test:tools`).

## Target Test Layout
```
tests/
  calculators/
  charts/
  developer-tools/
  file-converters/
  filters/
  helpful-calculators/
  media-converters/
  unit-conversions/
  docs/                      # existing fixtures
  media/                     # new minimal fixtures (png/mp3/mp4) if needed
```

## Per-Tool Test File Naming
- One file per tool, kebab-case, mirroring tool slug:
  - `tests/calculators/bmi.test.js`
  - `tests/file-converters/document-converter.test.js`
  - `tests/media-converters/image-converter.test.js`

## Fixture Strategy
- Reuse `tests/docs` for text/data/doc/spreadsheet conversions.
- Add minimal media fixtures under `tests/media/`:
  - `sample.png` (1x1 pixel for image conversions)
  - `sample.mp3` (short tone)
  - `sample.mp4` (1–2 second clip)
- If no fixture is needed (pure calculator or formatter), use inline payloads in the test.

## Category-by-Category Plan

### Unit Conversions
- Tests validate numeric conversion outputs with deterministic inputs.
- 1 test file per converter:
  - length, mass-weight, temperature, volume, currency, time, speed, area, energy, pressure, data-size, spacetime
- Currency converter should mock rates or use a fixed test rate input where supported.

### Calculators
- Tests pass known inputs and assert expected outputs or ranges.
- 1 test file per calculator:
  - graphing, scientific, bmi, loan, tip, percentage, date, calorie, protein, pregnancy, paint, flooring, concrete

### File Converters
- Use `tests/docs` fixtures to upload files and assert successful conversion and non-empty output.
- 1 test file per tool:
  - document-converter, spreadsheet-converter, data-format-converter, base64-file-encoder-decoder, archive-tools

### Media Converters
- Use `tests/media` fixtures; verify conversion completion and output size.
- 1 test file per tool:
  - image-converter, audio-converter, video-converter

### Developer Tools
- Tests pass sample strings and assert formatted/decoded output.
- 1 test file per tool:
  - json-formatter, base64-string-encoder-decoder, url-encoder-decoder, hash-generator, uuid-generator,
    timestamp-converter, regex-tester, jwt-decoder, xml-formatter, csv-formatter, text-case-converter,
    email-extractor, url-extractor, json-minifier, json-validator

### Filters
- For image/audio filters, use `tests/media` fixtures and assert output existence.
- 1 test file per tool:
  - image-effects, text-processor, audio-equalizer, reverb, echo, noise-reduction, normalize-audio, bass-boost

### Helpful Calculators
- Validate deterministic results or output shapes.
- 1 test file per tool:
  - recipe-scaler, secret-santa, holiday-countdown, crypto-converter, password-generator, cheatsheet-builder

### Charts
- Validate exported data structure, image export, or configuration output depending on tool behavior.
- 1 test file per tool:
  - gantt, bar, line, pie, scatter, area, sunburst, usa-map

## Execution Phases
1. **Inventory & Mapping**: Map each tool in `docs/tools-list.md` to a route/slug and target endpoint.
2. **Fixture Prep**: Add `tests/media` fixtures and verify `tests/docs` coverage.
3. **Scaffold Tests**: Create category folders and one test file per tool with a shared test helper.
4. **Wire Runner**: Add a test runner command that executes all tool tests.
5. **Validate**: Run tests locally and against the deployed API.

## Open Decisions
- Select test framework (Jest vs Vitest vs node-only scripts).
- Confirm required API base URL and credentials for CI.
- Confirm rate-limit bypass (API key) for test runs.
