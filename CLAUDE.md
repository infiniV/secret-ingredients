# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Secret Ingredients is a Next.js 16 skills portfolio that displays Claude Code skills in a gallery UI with ZIP download and install command copy functionality. Skills are parsed from the `/skills` folder at build time.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npx tsc --noEmit # Type check without emitting
```

## Architecture

### Skills System
- Skills live in `/skills/{skill-name}/SKILL.md` with YAML frontmatter (name, description, category, icon)
- `lib/skills.ts` parses skills using gray-matter, extracts frontmatter and content
- Skills are statically generated at build time via `generateStaticParams()`
- ZIP downloads created on-demand via `/api/download/[slug]` using archiver

### Claude Code Plugin
- `.claude-plugin/plugin.json` - Plugin metadata
- `.claude-plugin/marketplace.json` - Marketplace listing with skill references

### Component Structure
- `components/` - UI components (SkillCard, DownloadButton, CopyCommand, ThemeToggle)
- `components/art/` - Canvas-based algorithmic art (FloatingOrbs, WavePattern, GeometricMesh)
- `components/GridPattern.tsx` - SVG pattern with variants (dots, lines, crosses)

### Theming
- Theme colors defined in `app/globals.css` using oklch color space
- CSS variables: `--chart-1` through `--chart-5`, `--primary`, `--background`, etc.
- `next-themes` for dark/light/system mode toggle
- Art components use theme-aligned colors (warm oranges, purples, creams)

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)

## Adding New Skills

Create `skills/{skill-name}/SKILL.md`:
```markdown
---
name: skill-name
description: Brief description
category: category-name
icon: lucide-icon-name
---

# Skill content in markdown
```

The icon should be a valid Lucide icon name in kebab-case (e.g., `palette`, `file-text`).
