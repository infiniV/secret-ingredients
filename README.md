# Secret Ingredients

A skills portfolio for [Claude Code](https://claude.ai/code) that displays skills in a gallery UI with ZIP download and one-click install command copy.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Installing the Plugin

To install these skills in Claude Code, run:

```
/plugin install secret-ingredients@secret-ingredients-marketplace
```

Or download individual skills as ZIP files from the web interface.

## Adding Skills

Skills are stored in the `/skills` directory. Each skill is a folder containing a `SKILL.md` file with YAML frontmatter.

Create a new skill:

```bash
mkdir skills/my-skill
```

Then create `skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: A brief description of what this skill does
category: code-quality
icon: wand
---

# My Skill

Detailed documentation for the skill goes here.

## When to Use

Describe when Claude should use this skill.

## Process

1. Step one
2. Step two
3. Step three
```

The `icon` field accepts any [Lucide icon](https://lucide.dev/icons) name in kebab-case.

## Project Structure

```
secret-ingredients/
├── app/
│   ├── api/download/[slug]/   # ZIP download endpoint
│   ├── skills/[slug]/         # Skill detail pages
│   ├── globals.css            # Theme variables (oklch)
│   ├── layout.tsx             # Root layout with ThemeProvider
│   └── page.tsx               # Homepage gallery
├── components/
│   ├── art/                   # Algorithmic art (FloatingOrbs, WavePattern, etc.)
│   ├── SkillCard.tsx          # Gallery card component
│   ├── DownloadButton.tsx     # ZIP download button
│   ├── CopyCommand.tsx        # Clipboard copy component
│   └── ThemeToggle.tsx        # Light/dark/system toggle
├── lib/
│   └── skills.ts              # Skill parsing with gray-matter
├── skills/                    # Skill definitions (add your skills here)
└── .claude-plugin/            # Claude Code plugin configuration
```

## Theming

The project uses a warm color palette with oranges, purples, and creams. Theme variables are defined in `app/globals.css` using the oklch color space. Both light and dark modes are supported.

To customize colors, edit the CSS variables in `:root` and `.dark` selectors.

## Build

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing
- [archiver](https://github.com/archiverjs/node-archiver) for ZIP generation
- [Lucide React](https://lucide.dev) for icons

## Deploy

Deploy to [Vercel](https://vercel.com) for the best experience with Next.js:

```bash
npx vercel
```

Or check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other platforms.

## License

MIT
