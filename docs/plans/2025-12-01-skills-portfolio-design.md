# Skills Portfolio Design

A Next.js website to showcase and distribute Claude Code skills, with both visual gallery UI and GitHub-based plugin installation.

## Goals

- Display skills in a clean gallery UI
- Allow download as ZIP or copy install command
- Skills live in same repo (single source of truth)
- Works with Vercel deployment
- Compatible with Claude Code plugin system

## Project Structure

```
secret-ingredients/
├── app/
│   ├── page.tsx                    # Homepage - skill gallery grid
│   ├── skills/
│   │   └── [slug]/
│   │       └── page.tsx            # Individual skill detail page
│   └── api/
│       └── download/
│           └── [slug]/
│               └── route.ts        # ZIP download endpoint
├── components/
│   ├── SkillCard.tsx               # Card for gallery grid
│   └── DownloadButton.tsx          # Download as ZIP button
├── lib/
│   └── skills.ts                   # Reads /skills folder at build time
├── skills/                         # Actual skills (source of truth)
│   └── <skill-name>/
│       ├── SKILL.md
│       └── (supporting files)
└── .claude-plugin/
    ├── plugin.json                 # Plugin metadata
    └── marketplace.json            # For /plugin install support
```

## Skill Format

Each skill follows Anthropic's official Agent Skills Spec with extended frontmatter:

```yaml
---
name: theme-checker
description: Checks codebase for theme consistency and flags violations
category: code-quality
icon: palette
---

# Theme Checker

(Skill instructions here...)
```

### Required Fields
- `name` - Lowercase hyphen-case, matches folder name
- `description` - What the skill does

### UI Extension Fields
- `category` - For grouping (code-quality, design-system, planning, workflow)
- `icon` - Lucide icon name

## Pages

### Homepage (`/`)
- Header with project name
- Responsive grid of skill cards (1 col mobile, 2-3 cols desktop)
- Each card: icon, name, short description, category tag
- Uses existing CSS variables (--card, --primary, --muted, etc.)

### Skill Detail (`/skills/[slug]`)
- Back link to gallery
- Skill name + icon + category badge
- Full description rendered as markdown
- Action buttons:
  - Download ZIP (entire skill folder)
  - Copy Install Command
- List of included files

## Data Flow

### Build Time (Static Generation)
1. `lib/skills.ts` scans `/skills` folder
2. Parses SKILL.md frontmatter + body for each skill
3. Returns typed skill data
4. Pages use `generateStaticParams` for static generation

### ZIP Download (API Route)
- `/api/download/[slug]` zips skill folder on-demand
- Uses `archiver` package
- Streams ZIP back to client
- Works on Vercel serverless

## Dependencies

Add:
- `gray-matter` - Parse YAML frontmatter
- `archiver` - Create ZIP files
- `@types/archiver` - TypeScript types

## Plugin Configuration

### plugin.json
```json
{
  "name": "secret-ingredients",
  "description": "Specialized Claude Code skills",
  "version": "1.0.0"
}
```

### marketplace.json
```json
{
  "name": "secret-ingredients-marketplace",
  "plugins": [
    {
      "name": "secret-ingredients",
      "skills": ["./skills/*"]
    }
  ]
}
```

## Not Included (YAGNI)
- No database
- No auth
- No search
- No analytics
- No category filtering UI (can add later)
