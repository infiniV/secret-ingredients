---
name: ui-consistency
description: Use when auditing or fixing UI consistency issues like mismatched spacing, hardcoded colors, theme violations, or elements that look off - provides systematic checklist for theme, spacing, typography audits and proper techniques for canvas/SVG theming with reactivity
category: code-quality
icon: layout-grid
---

# UI Consistency

## Overview

Systematic methodology for auditing and fixing UI consistency. The skill enforces: audit before fix, stay in theme system, verify in both modes.

**Core principle:** Finding issues is easy. Fixing them correctly requires understanding the rendering context (CSS, canvas, SVG) and theme reactivity.

## When to Use

- UI elements "look off" or inconsistent
- Hardcoded colors detected in codebase
- Spacing/padding varies across similar components
- Theme switching causes visual breaks
- Canvas or SVG elements don't respond to theme

## Audit Checklist

Run through EACH category before proposing fixes:

### 1. Theme Colors
```bash
# Find hardcoded colors (excluding CSS variable definitions)
grep -rn "rgba\|rgb\|#[0-9a-fA-F]\{3,8\}\|hsl\|oklch" --include="*.tsx" --include="*.ts" | grep -v "globals.css\|\.css:"
```
- Are all colors using CSS variables?
- Do canvas elements use theme colors?
- Do SVG elements use currentColor or CSS variables?

### 2. Spacing Scale
Check for consistent spacing tokens:
- `gap-*` values across similar components
- `p-*` and `m-*` on similar elements
- `space-y-*` and `space-x-*` patterns

### 3. Border Radius
- Nested elements should have smaller radius than containers
- Similar purpose = similar radius (buttons match buttons)

### 4. Typography
- Heading hierarchy (h1 > h2 > h3 in size)
- Similar elements use same font-size/weight

### 5. Interactive States
- Hover patterns consistent across similar elements
- Focus states present and visible
- Active/pressed states defined

## Canvas Theming (Critical)

**Canvas CANNOT parse CSS variable syntax:**
```typescript
// WRONG: Canvas doesn't understand var()
ctx.fillStyle = "rgba(var(--chart-1-rgb), 0.15)"; // FAILS - treated as invalid color

// WRONG: Only runs once, no theme reactivity
const color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
ctx.fillStyle = color; // Works initially but never updates on theme change
```

**Correct approach - Explicit extraction + theme reactivity:**
```typescript
// 1. Define RGB values in globals.css for canvas use:
// :root { --chart-1-rgb: 180, 100, 60; }
// .dark { --chart-1-rgb: 200, 120, 80; }

// 2. Extract and use in canvas:
function getCanvasColor(variable: string, alpha: number): string {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue(variable).trim();
  return `rgba(${rgb}, ${alpha})`;
}

// In draw function:
ctx.fillStyle = getCanvasColor('--chart-1-rgb', 0.15);

// 3. Add theme change listener:
useEffect(() => {
  const observer = new MutationObserver(() => {
    drawCanvas(); // Redraw with new colors
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'] // Theme toggle changes class
  });
  return () => observer.disconnect();
}, []);
```

**Key points:**
- Canvas API does NOT parse `var(--name)` - it receives literal string
- Must use getComputedStyle() to READ the actual value
- oklch() values require conversion (use color library or define RGB equivalents)
- **MANDATORY: Add MutationObserver for theme changes** - without it, colors are read once and never update

**Theme reactivity is NOT optional.** If you fix canvas colors but don't add theme change handling, the fix is incomplete. Users will toggle dark mode and see stale colors.

## SVG Theming

**Wrong:**
```tsx
// BAD: className doesn't work on SVG paint attributes
<stop stopColor="white" className="fill-background" />
```

**Correct approaches:**

1. **Use currentColor:**
```tsx
<svg className="text-primary"> {/* Set color via CSS */}
  <path fill="currentColor" />
</svg>
```

2. **CSS variables in style prop:**
```tsx
<stop stopColor="var(--background)" stopOpacity="1" />
```

3. **For gradients needing theme colors:**
```tsx
<linearGradient id="fade">
  <stop offset="0%" style={{ stopColor: 'var(--background)' }} stopOpacity="1" />
  <stop offset="100%" style={{ stopColor: 'var(--background)' }} stopOpacity="0" />
</linearGradient>
```

## Theme System Rules

**Never introduce colors outside the theme:**

| Wrong | Right |
|-------|-------|
| `text-green-500` | Add `--success` to theme, use `text-success` |
| `bg-gray-100` | Use `bg-muted` or `bg-secondary` |
| `border-slate-200` | Use `border-border` |
| `rgba(180, 100, 60, 0.15)` | Use theme variable with opacity |

**Adding new semantic colors:**
```css
/* In globals.css */
:root {
  --success: oklch(0.5490 0.1260 142.4950);
  --warning: oklch(0.7690 0.1530 70.0800);
}
.dark {
  --success: oklch(0.6490 0.1460 142.4950);
  --warning: oklch(0.8190 0.1230 70.0800);
}
```

## Verification Requirements

**MANDATORY before claiming fixes complete:**

1. Test in light mode - visual inspection
2. Test in dark mode - visual inspection
3. Toggle between modes - verify transitions
4. Check elements render correctly in both
5. Run the app, don't just read code

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|--------------|-----|
| `ctx.fillStyle = "rgba(var(--x), 0.5)"` | Canvas doesn't parse var() | Use getComputedStyle() to extract value first |
| Append hex alpha to oklch | `oklch(...)4D` is invalid | Convert oklch to rgb first, or use opacity property |
| `getComputedStyle` once | No theme reactivity | Use MutationObserver or theme context |
| Tailwind classes on SVG paint | Classes don't set fill/stroke | Use currentColor or style prop |
| Skip dark mode testing | Issues only visible in one mode | Always test both modes |
| "It looks fine to me" | Didn't actually run the app | Run dev server, visual verify |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "The audit found issues, my fixes are correct" | Finding issues is easy. Fixing correctly requires understanding canvas/SVG/CSS contexts. Verify fixes work. |
| "Time pressure - just ship it" | Broken theme = broken for half your users. Take 2 min to test both modes. |
| "Canvas will parse var() like CSS does" | No. Canvas API receives literal strings. It doesn't interpret CSS syntax. |
| "I'll add theme reactivity later" | Colors will be stale on theme toggle. Do it now or users report bugs. |
| "Tailwind green-500 is fine for success" | You just broke theme consistency. Add --success to theme, use it. |
| "The SVG looks fine with className" | className doesn't set fill/stroke. Use currentColor or style prop. |
| "I tested in light mode, it works" | Dark mode may be completely broken. Test both. Always. |

## Red Flags - Stop and Reconsider

- Using `var(--name)` syntax directly in canvas context (canvas doesn't parse it)
- Proposing canvas fixes without theme reactivity
- Using Tailwind color classes (green-500, gray-100) instead of theme
- Fixing SVG with className on paint attributes
- Not mentioning testing in both light/dark modes
- Time pressure leading to skipped verification

## Priority Framework

Fix in this order:
1. **Critical:** Hardcoded colors in theme-aware contexts (breaks dark mode)
2. **High:** Spacing inconsistencies affecting layout
3. **Medium:** Border radius mismatches
4. **Low:** Minor typography variations

## Quick Debugging

**Element looks off?**
1. Inspect in dev tools
2. Check computed styles for hardcoded values
3. Compare with similar elements
4. Verify parent constraints

**Theme not applying?**
1. Check if CSS variable is defined in both :root and .dark
2. Verify element uses var(--name) not hardcoded value
3. For canvas/SVG, check if theme reactivity is implemented
