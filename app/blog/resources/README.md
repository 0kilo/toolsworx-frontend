# Blog Resources Structure (Per-Trip)

Each trip owns its own resources folder under the adventure slug.

```
app/blog/adventures/<trip-slug>/
  page.tsx
  <trip>.md
  resources/
    README.md
    what-to-pack/
      page.tsx
      content.md
    tips/
      page.tsx
      content.md
    tools/
      page.tsx
      content.md
```

## Notes
- `content.md` holds the written content (easy to edit).
- `page.tsx` renders the content and provides layout + metadata.
- Add affiliate links directly in `content.md` (Markdown links).
- Use one resources folder per trip.
