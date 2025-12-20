# AdSense Low-Value Content Checklist

Use this list top-to-bottom. Finish each item before moving to the next. Keep wording accurate and avoid overpromising.

## Highest Priority (Blocking)
- [ ] Remove or `noindex` all `/template` routes (file/media/filters/charts/calculators/etc.) so placeholders are not indexed.
- [ ] Remove or `noindex` disabled tool routes (e.g., `/helpful-calculators/shipping-cost`) until fully functional.
- [ ] Fix any misrepresentative claims:
  - [ ] Replace “100% client-side processing” where conversions run server-side.
  - [ ] Align privacy/security claims with actual behavior (uploads, retention, deletion).
- [ ] Make category duplication clear:
  - [ ] Choose a canonical set (either `/category/*` or root category pages).
  - [ ] `noindex` or redirect the non-canonical set.

## High Priority (Quality Signals)
- [ ] Add unique, tool-specific “How to use” sections (3–5 steps).
- [ ] Add at least one concrete example per tool (input → output).
- [ ] Add short, tool-specific FAQs (3–5 items).
- [ ] Add limitations/edge cases per tool (what it won’t do).
- [ ] Ensure 2–4 contextual internal links per tool page.

## Medium Priority (Trust & UX)
- [ ] Make author/publisher intent visible on home/about (why the tools exist).
- [ ] Add “last updated” or version hints on key pages where possible.
- [ ] Keep contact and policy pages visible in the footer (Contact, Privacy, Terms, Content Policy).
- [ ] Confirm no deceptive UI patterns (no fake buttons, no misleading CTAs).

## Lower Priority (Nice-to-Have)
- [ ] Add screenshots or short GIFs for complex tools (charts, filters).
- [ ] Add schema where helpful (FAQ schema on FAQ-heavy pages).
- [ ] Optimize page titles/descriptions for uniqueness and specificity.
