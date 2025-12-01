# Secret Ingredients

Specialized skills for Claude Code focused on UI planning, theming, and code quality.

## Installation

Install the full skill collection in Claude Code:

```
/plugin install secret-ingredients@secret-ingredients-marketplace
```

Or browse individual skills at the web gallery and download as ZIP files.

## Available Skills

### theme-checker

Analyzes codebases for theme consistency, checking CSS variables, color usage, and design token adherence across components. Use when auditing for inconsistent colors, verifying design tokens, or ensuring dark mode compatibility.

## Creating Your Own Skills

Skills live in the `/skills` directory. Each skill is a folder with a `SKILL.md` file.

```bash
mkdir skills/my-skill
```

Create `skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: A brief description of what this skill does
category: code-quality
icon: wand
---

# My Skill

Detailed documentation goes here.

## When to Use

Describe when Claude should use this skill.

## Process

1. Step one
2. Step two
3. Step three
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name for the skill |
| `description` | Yes | Brief description shown in gallery |
| `category` | No | Grouping category (defaults to "general") |
| `icon` | No | [Lucide icon](https://lucide.dev/icons) name in kebab-case |

### Skill Categories

- `code-quality` - Linting, consistency checks, code review
- `ui` - Interface design and component patterns
- `theming` - Colors, design tokens, dark mode
- `general` - Everything else

## Running the Gallery

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse skills.

## Deployment

```bash
npm run build
npm run start
```

Or deploy to Vercel:

```bash
npx vercel
```

## License

MIT
