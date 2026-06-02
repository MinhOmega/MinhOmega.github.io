---
name: fix-nested-scrollbars
description: Fix nested scrollbar issues in Next.js layouts where h-screen + overflow-y-scroll on panels creates multiple scroll contexts
source: auto-skill
extracted_at: '2026-06-02T07:51:28.369Z'
---

# Fix Nested Scrollbars in Next.js Layouts

When a page layout uses `h-screen` (or `h-dvh`) on a container and `overflow-y-scroll` on child panels, it creates multiple independent scroll contexts. This results in 2-3 visible scrollbars instead of one. The fix is to let content flow naturally with a single page scrollbar.

## Diagnosis Pattern

Look for this anti-pattern in layout/page components:

```jsx
// BAD — creates multiple scroll contexts
<main className="lg:h-screen">                    {/* fixed viewport height */}
  <div className="flex lg:divide-x">
    <div className="lg:h-full lg:overflow-y-scroll">  {/* scrollbar 1 */}
      {/* left panel content */}
    </div>
    <div className="lg:h-full lg:overflow-y-scroll">  {/* scrollbar 2 */}
      {/* right panel content */}
    </div>
  </div>
</main>
// body/html can also scroll if padding pushes past 100vh  {/* scrollbar 3 */}
```

This produces up to **3 scrollbars**:
1. The `<body>` / `<html>` (if padding causes overflow past `100vh`)
2. Left panel (independent scroll)
3. Right panel (independent scroll)

## Fix

Replace `h-screen` with `min-h-screen` on the outer container, and remove `overflow-y-scroll` and `h-full` from inner panels:

```jsx
// GOOD — single page scrollbar
<main className="min-h-screen">                   {/* grows with content */}
  <div className="flex lg:divide-x">
    <div>                                          {/* flows naturally */}
      {/* left panel content */}
    </div>
    <div>                                          {/* flows naturally */}
      {/* right panel content */}
    </div>
  </div>
</main>
```

## Checklist

1. **Outer container**: `lg:h-screen` → `min-h-screen`
2. **Inner panels**: Remove `lg:h-full`, `lg:overflow-y-scroll`, `scroll-smooth`
3. **Preserve column layout**: Keep `lg:w-*` widths and `flex`/`lg:divide-x` for side-by-side structure
4. **Check globals.css**: Ensure `body` has no `overflow: hidden` that would clip content
5. **Sticky elements**: If panels used sticky headers with `overflow-y-scroll`, sticky positioning still works within the page scroll context — no changes needed

## Variant: Sticky Panel + Hidden Scrollbars

When you want one panel to stay in view while the other scrolls (e.g., blog metadata/TOC sidebar), combine sticky positioning with hidden scrollbars:

```jsx
// Blog page: sticky left panel, flowing right panel
<main className="min-h-screen p-0 sm:p-5">
  <div className="flex flex-wrap lg:divide-x">
    {/* Left panel: sticky, self-scrolling if content exceeds viewport */}
    <div className="lg:w-2/5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-hide">
      {/* metadata, TOC, etc. */}
    </div>
    {/* Right panel: flows naturally, determines page height */}
    <article className="lg:w-3/5">
      {/* long content */}
    </article>
  </div>
</main>
```

### Hidden scrollbar CSS (globals.css)

```css
/* Hide page scrollbar */
html {
  scrollbar-width: none;
}
html::-webkit-scrollbar {
  display: none;
}

/* Utility class for hiding scrollbars on specific elements */
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

This gives a clean look: no visible scrollbars anywhere, left panel stays pinned while scrolling the right panel content. Works on both Firefox (`scrollbar-width: none`) and Chromium/Safari (`::-webkit-scrollbar`).

## When NOT to apply

- **App shell / dashboard layouts** where independent panel scrolling is intentional (e.g., VS Code–style fixed-height panels)
- **Modal / dialog overlays** that need contained scrolling
- **Embed iframes** or embedded content that must scroll independently
