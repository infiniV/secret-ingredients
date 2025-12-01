# Skills Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use superpowers:dispatching-parallel-agents for parallel groups.

**Goal:** Build a Next.js skills portfolio that displays Claude Code skills in a gallery UI with ZIP download and install command copy.

**Architecture:** Static generation at build time from `/skills` folder. API route for ZIP downloads. shadcn/ui design system with existing CSS variables.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, gray-matter, archiver, Lucide icons

**Theme Constraints:** Use ONLY these CSS variable classes from globals.css:
- Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-secondary`, `bg-accent`
- Text: `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `text-primary-foreground`
- Borders: `border-border`, `border-input`
- Radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`
- Charts (for art): `bg-chart-1` through `bg-chart-5`

---

## Parallel Group 1: Foundation (No Dependencies)

These 5 tasks can be executed simultaneously by separate subagents.

---

### Task 1.1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run:
```bash
npm install gray-matter archiver
npm install -D @types/archiver
```

**Step 2: Verify installation**

Run: `cat package.json | grep -E "gray-matter|archiver"`

Expected: Both packages listed in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add gray-matter and archiver dependencies"
```

---

### Task 1.2: Create Skills Folder with Sample Skill

**Files:**
- Create: `skills/theme-checker/SKILL.md`

**Step 1: Create skill folder and file**

Create `skills/theme-checker/SKILL.md`:

```markdown
---
name: theme-checker
description: Analyzes codebase for theme consistency, checking CSS variables, color usage, and design token adherence across components
category: code-quality
icon: palette
---

# Theme Checker

Check a codebase for theme consistency and flag violations.

## When to Use

Use this skill when you need to:
- Audit a codebase for inconsistent color usage
- Verify design token adherence
- Find hardcoded colors that should use CSS variables
- Ensure dark mode compatibility

## Process

1. **Scan for color definitions** - Find all CSS files, Tailwind configs, and inline styles
2. **Identify violations** - Flag hardcoded hex/rgb values that should use variables
3. **Check variable usage** - Verify components use theme variables correctly
4. **Report findings** - Summarize issues by severity and file

## What to Check

- Hardcoded colors in CSS/Tailwind classes
- Missing dark mode variants
- Inconsistent variable naming
- Unused theme variables
- Direct color values in component styles

## Output Format

Provide a report with:
- Total files scanned
- Violations found (grouped by type)
- Recommended fixes
- Severity rating (critical/warning/info)
```

**Step 2: Verify file exists**

Run: `cat skills/theme-checker/SKILL.md | head -10`

Expected: YAML frontmatter with name, description, category, icon

**Step 3: Commit**

```bash
git add skills/
git commit -m "feat: add sample theme-checker skill"
```

---

### Task 1.3: Create Plugin Configuration

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`

**Step 1: Create plugin.json**

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "secret-ingredients",
  "description": "Specialized Claude Code skills for UI, theming, and code quality",
  "version": "1.0.0",
  "author": {
    "name": "Secret Ingredients"
  },
  "homepage": "https://github.com/yourusername/secret-ingredients",
  "repository": "https://github.com/yourusername/secret-ingredients",
  "license": "MIT",
  "keywords": ["skills", "ui", "theming", "code-quality"]
}
```

**Step 2: Create marketplace.json**

Create `.claude-plugin/marketplace.json`:

```json
{
  "name": "secret-ingredients-marketplace",
  "owner": {
    "name": "Secret Ingredients"
  },
  "metadata": {
    "description": "Specialized skills for UI and theming",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "secret-ingredients",
      "description": "Specialized Claude Code skills for UI, theming, and code quality",
      "source": "./",
      "strict": false,
      "skills": [
        "./skills/theme-checker"
      ]
    }
  ]
}
```

**Step 3: Verify files**

Run: `ls -la .claude-plugin/`

Expected: Both plugin.json and marketplace.json present

**Step 4: Commit**

```bash
git add .claude-plugin/
git commit -m "feat: add Claude Code plugin configuration"
```

---

### Task 1.4: Create Skill Types and Parser

**Files:**
- Create: `lib/skills.ts`

**Step 1: Create skills library**

Create `lib/skills.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  content: string;
  files: string[];
}

export interface SkillFrontmatter {
  name: string;
  description: string;
  category?: string;
  icon?: string;
}

const SKILLS_DIR = path.join(process.cwd(), "skills");

export function getSkillSlugs(): string[] {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }
  return fs.readdirSync(SKILLS_DIR).filter((name) => {
    const skillPath = path.join(SKILLS_DIR, name);
    return (
      fs.statSync(skillPath).isDirectory() &&
      fs.existsSync(path.join(skillPath, "SKILL.md"))
    );
  });
}

export function getSkillBySlug(slug: string): Skill | null {
  const skillDir = path.join(SKILLS_DIR, slug);
  const skillFile = path.join(skillDir, "SKILL.md");

  if (!fs.existsSync(skillFile)) {
    return null;
  }

  const fileContents = fs.readFileSync(skillFile, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as SkillFrontmatter;

  const files = getSkillFiles(skillDir);

  return {
    slug,
    name: frontmatter.name,
    description: frontmatter.description,
    category: frontmatter.category || "general",
    icon: frontmatter.icon || "file-text",
    content,
    files,
  };
}

function getSkillFiles(skillDir: string): string[] {
  const files: string[] = [];

  function walkDir(dir: string, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), relativePath);
      } else {
        files.push(relativePath);
      }
    }
  }

  walkDir(skillDir);
  return files;
}

export function getAllSkills(): Skill[] {
  const slugs = getSkillSlugs();
  return slugs
    .map((slug) => getSkillBySlug(slug))
    .filter((skill): skill is Skill => skill !== null);
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit lib/skills.ts 2>&1 || echo "Check for errors"`

Expected: No errors (or only module resolution warnings acceptable at this stage)

**Step 3: Commit**

```bash
git add lib/skills.ts
git commit -m "feat: add skill parsing library"
```

---

### Task 1.5: Update Layout with Metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update layout**

Replace `app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Ingredients | Claude Code Skills",
  description: "Specialized skills for Claude Code - UI planning, theming, and code quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Verify no syntax errors**

Run: `npx tsc --noEmit app/layout.tsx 2>&1 || echo "Check for errors"`

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: update layout with project metadata"
```

---

## Parallel Group 2: Components (Depends on Group 1)

These 3 tasks can be executed simultaneously after Group 1 completes.

---

### Task 2.1: Create SkillCard Component

**Files:**
- Create: `components/SkillCard.tsx`

**Step 1: Create component**

Create `components/SkillCard.tsx`:

```typescript
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface SkillCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export function SkillCard({
  slug,
  name,
  description,
  category,
  icon,
}: SkillCardProps) {
  const IconComponent =
    (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
      toPascalCase(icon)
    ] || LucideIcons.FileText;

  return (
    <Link
      href={`/skills/${slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-300 hover:border-primary/20 hover:shadow-lg",
        "hover:-translate-y-1"
      )}
    >
      {/* Decorative gradient orb */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-0",
          "bg-gradient-to-br from-chart-1/20 to-chart-2/20 blur-2xl",
          "transition-opacity duration-500 group-hover:opacity-100"
        )}
      />

      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            "bg-muted text-muted-foreground",
            "transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
          )}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        <span
          className={cn(
            "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
          )}
        >
          {category}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-card-foreground">{name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "mt-auto flex items-center gap-2 text-sm font-medium text-muted-foreground",
          "transition-colors group-hover:text-primary"
        )}
      >
        <span>View skill</span>
        <LucideIcons.ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
```

**Step 2: Verify component compiles**

Run: `npx tsc --noEmit components/SkillCard.tsx 2>&1 || echo "Check"`

**Step 3: Commit**

```bash
git add components/SkillCard.tsx
git commit -m "feat: add SkillCard component"
```

---

### Task 2.2: Create DownloadButton Component

**Files:**
- Create: `components/DownloadButton.tsx`

**Step 1: Create component**

Create `components/DownloadButton.tsx`:

```typescript
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Check, Loader2 } from "lucide-react";

interface DownloadButtonProps {
  slug: string;
  skillName: string;
}

export function DownloadButton({ slug, skillName }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleDownload() {
    setStatus("loading");
    try {
      const response = await fetch(`/api/download/${slug}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Download error:", error);
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={status === "loading"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
        "bg-primary text-primary-foreground font-medium",
        "transition-all duration-200",
        "hover:opacity-90 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === "success" && <Check className="h-4 w-4" />}
      {status === "idle" && <Download className="h-4 w-4" />}
      <span>
        {status === "loading"
          ? "Downloading..."
          : status === "success"
            ? "Downloaded!"
            : "Download ZIP"}
      </span>
    </button>
  );
}
```

**Step 2: Verify component compiles**

Run: `npx tsc --noEmit components/DownloadButton.tsx 2>&1 || echo "Check"`

**Step 3: Commit**

```bash
git add components/DownloadButton.tsx
git commit -m "feat: add DownloadButton component"
```

---

### Task 2.3: Create CopyCommand Component

**Files:**
- Create: `components/CopyCommand.tsx`

**Step 1: Create component**

Create `components/CopyCommand.tsx`:

```typescript
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Terminal } from "lucide-react";

interface CopyCommandProps {
  command: string;
}

export function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-muted p-3"
      )}
    >
      <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" />
      <code className="flex-1 font-mono text-sm text-foreground">{command}</code>
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2",
          "text-muted-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-chart-2" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npx tsc --noEmit components/CopyCommand.tsx 2>&1 || echo "Check"`

**Step 3: Commit**

```bash
git add components/CopyCommand.tsx
git commit -m "feat: add CopyCommand component"
```

---

## Parallel Group 3: Pages & API (Depends on Group 2)

These 3 tasks can be executed simultaneously after Group 2 completes.

---

### Task 3.1: Create Homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Create homepage**

Replace `app/page.tsx` with:

```typescript
import { getAllSkills } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const skills = getAllSkills();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -left-40 -top-40 h-80 w-80 rounded-full",
            "bg-gradient-to-br from-chart-1/10 to-chart-3/10 blur-3xl"
          )}
        />
        <div
          className={cn(
            "absolute -bottom-40 -right-40 h-80 w-80 rounded-full",
            "bg-gradient-to-br from-chart-2/10 to-chart-4/10 blur-3xl"
          )}
        />
      </div>

      <main className="relative mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <div
            className={cn(
              "mb-6 inline-flex items-center gap-2 rounded-full",
              "bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Claude Code Skills</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Secret Ingredients
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Specialized skills for UI planning, theming, and code quality.
            Download individually or install the full collection.
          </p>

          {/* Install command */}
          <div
            className={cn(
              "mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-xl",
              "border border-border bg-card p-4"
            )}
          >
            <code className="flex-1 font-mono text-sm text-foreground">
              /plugin install secret-ingredients@secret-ingredients-marketplace
            </code>
          </div>
        </header>

        {/* Skills Grid */}
        {skills.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.slug}
                slug={skill.slug}
                name={skill.name}
                description={skill.description}
                category={skill.category}
                icon={skill.icon}
              />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 py-24",
              "rounded-xl border border-dashed border-border"
            )}
          >
            <p className="text-muted-foreground">No skills yet</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>
            Skills are compatible with{" "}
            <a
              href="https://docs.claude.com"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Claude Code
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
```

**Step 2: Verify page compiles**

Run: `npx tsc --noEmit app/page.tsx 2>&1 || echo "Check"`

**Step 3: Run dev server and check**

Run: `npm run dev &` then visit http://localhost:3000

Expected: Homepage displays with header and skill card

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add skills gallery homepage"
```

---

### Task 3.2: Create Skill Detail Page

**Files:**
- Create: `app/skills/[slug]/page.tsx`

**Step 1: Create detail page**

Create `app/skills/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSkillBySlug, getSkillSlugs } from "@/lib/skills";
import { DownloadButton } from "@/components/DownloadButton";
import { CopyCommand } from "@/components/CopyCommand";
import { cn } from "@/lib/utils";
import { ArrowLeft, FileText } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getSkillSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const IconComponent =
    (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
      toPascalCase(skill.icon)
    ] || LucideIcons.FileText;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -right-40 top-20 h-96 w-96 rounded-full",
            "bg-gradient-to-br from-chart-1/5 to-chart-2/5 blur-3xl"
          )}
        />
      </div>

      <main className="relative mx-auto max-w-4xl px-6 py-16">
        {/* Back link */}
        <Link
          href="/"
          className={cn(
            "mb-8 inline-flex items-center gap-2 text-sm font-medium",
            "text-muted-foreground transition-colors hover:text-foreground"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all skills
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start gap-6">
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
                "bg-primary text-primary-foreground"
              )}
            >
              <IconComponent className="h-8 w-8" />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {skill.name}
                </h1>
                <span
                  className={cn(
                    "rounded-full bg-secondary px-3 py-1",
                    "text-xs font-medium text-secondary-foreground"
                  )}
                >
                  {skill.category}
                </span>
              </div>
              <p className="text-lg text-muted-foreground">{skill.description}</p>
            </div>
          </div>
        </header>

        {/* Actions */}
        <section className="mb-12 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Install</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Via Claude Code plugin:
              </p>
              <CopyCommand command="/plugin install secret-ingredients@secret-ingredients-marketplace" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Or download directly:
              </p>
              <DownloadButton slug={skill.slug} skillName={skill.name} />
            </div>
          </div>
        </section>

        {/* Files included */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Files Included
          </h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <ul className="space-y-2">
              {skill.files.map((file) => (
                <li key={file} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <code className="font-mono text-sm text-foreground">{file}</code>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Content */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Skill Documentation
          </h2>
          <div
            className={cn(
              "prose prose-neutral dark:prose-invert max-w-none",
              "rounded-xl border border-border bg-card p-6"
            )}
          >
            <div className="whitespace-pre-wrap font-mono text-sm">
              {skill.content}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
```

**Step 2: Verify page compiles**

Run: `npx tsc --noEmit app/skills/\[slug\]/page.tsx 2>&1 || echo "Check"`

**Step 3: Test navigation**

Visit http://localhost:3000/skills/theme-checker

Expected: Detail page shows skill info with download button

**Step 4: Commit**

```bash
git add app/skills/
git commit -m "feat: add skill detail page"
```

---

### Task 3.3: Create ZIP Download API

**Files:**
- Create: `app/api/download/[slug]/route.ts`

**Step 1: Create API route**

Create `app/api/download/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { Readable } from "stream";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skillDir = path.join(process.cwd(), "skills", slug);

  if (!fs.existsSync(skillDir)) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const chunks: Buffer[] = [];

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("data", (chunk: Buffer) => chunks.push(chunk));

  archive.directory(skillDir, slug);

  await archive.finalize();

  const buffer = Buffer.concat(chunks);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
    },
  });
}
```

**Step 2: Verify API compiles**

Run: `npx tsc --noEmit app/api/download/\[slug\]/route.ts 2>&1 || echo "Check"`

**Step 3: Test download**

Run: `curl -I http://localhost:3000/api/download/theme-checker`

Expected: 200 response with Content-Type: application/zip

**Step 4: Commit**

```bash
git add app/api/
git commit -m "feat: add ZIP download API route"
```

---

## Parallel Group 4: Polish & Art (Depends on Group 3)

These 2 tasks can be executed simultaneously after Group 3 completes.

---

### Task 4.1: Add Algorithmic Art Background Component

**Files:**
- Create: `components/GridPattern.tsx`

**Step 1: Create decorative pattern component**

Create `components/GridPattern.tsx`:

```typescript
import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
}

export function GridPattern({ className }: GridPatternProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1"
            cy="1"
            r="1"
            className="fill-border/50"
          />
        </pattern>
        <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="50%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width="100%" height="100%" fill="url(#fade-gradient)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#grid-pattern)"
        mask="url(#fade-mask)"
      />
    </svg>
  );
}
```

**Step 2: Commit**

```bash
git add components/GridPattern.tsx
git commit -m "feat: add decorative grid pattern component"
```

---

### Task 4.2: Integrate Grid Pattern into Homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add import and component**

At top of `app/page.tsx`, add import:

```typescript
import { GridPattern } from "@/components/GridPattern";
```

After the opening `<div className="relative min-h-screen bg-background">`, add:

```typescript
<GridPattern className="opacity-50" />
```

**Step 2: Verify visually**

Visit http://localhost:3000

Expected: Subtle dot grid pattern visible in background

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add grid pattern to homepage"
```

---

## Final Task: Build Verification

**Step 1: Run production build**

Run: `npm run build`

Expected: Build completes with no errors

**Step 2: Test production server**

Run: `npm run start`

Visit http://localhost:3000

Expected: Homepage loads, skill cards display, navigation works, download works

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete skills portfolio implementation"
```

---

## Execution Summary

| Group | Tasks | Can Parallelize | Dependencies |
|-------|-------|-----------------|--------------|
| 1 | 1.1, 1.2, 1.3, 1.4, 1.5 | Yes (5 parallel) | None |
| 2 | 2.1, 2.2, 2.3 | Yes (3 parallel) | Group 1 |
| 3 | 3.1, 3.2, 3.3 | Yes (3 parallel) | Group 2 |
| 4 | 4.1, 4.2 | Yes (2 parallel) | Group 3 |
| Final | Build verification | No | All |

**Maximum parallelization: 5 simultaneous agents per group**

**Total tasks: 14**
**Sequential groups: 5**
