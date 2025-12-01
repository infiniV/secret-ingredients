import { getAllSkills } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { GridPattern } from "@/components/GridPattern";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WavePattern, FloatingOrbs } from "@/components/art";
import { Sparkles, FolderOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const skills = getAllSkills();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Theme Toggle */}
      <nav aria-label="Site controls" className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </nav>

      {/* Algorithmic Art Background */}
      <GridPattern variant="dots" className="opacity-60" />
      <WavePattern waveCount={3} speed={0.015} />
      <FloatingOrbs orbCount={3} />

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className={cn(
            "absolute -right-40 top-20 h-96 w-96 rounded-full",
            "bg-gradient-to-br from-chart-1/15 to-chart-2/15 blur-3xl",
            "animate-pulse"
          )}
          style={{ animationDuration: "8s" }}
        />
        <div
          className={cn(
            "absolute -left-20 bottom-40 h-64 w-64 rounded-full",
            "bg-gradient-to-br from-chart-5/10 to-primary/10 blur-3xl",
            "animate-pulse"
          )}
          style={{ animationDuration: "10s" }}
        />
      </div>

      <main id="main-content" className="relative mx-auto max-w-6xl px-6 py-16">
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

          {/* Install commands */}
          {/* <div
            className={cn(
              "mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-xl",
              "border border-border bg-card p-4"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">1.</span>
              <code className="flex-1 font-mono text-sm text-foreground">
                /plugin marketplace add infiniV/secret-ingredients
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">2.</span>
              <code className="flex-1 font-mono text-sm text-foreground">
                /plugin install secret-ingredients@secret-ingredients-marketplace
              </code>
            </div>
          </div> */}
        </header>

        {/* Skills Grid */}
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="sr-only">Available Skills</h2>
          {skills.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {skills.map((skill) => (
                <li key={skill.slug}>
                  <SkillCard
                    slug={skill.slug}
                    name={skill.name}
                    description={skill.description}
                    category={skill.category}
                    icon={skill.icon}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-6 py-24",
                "rounded-xl border border-dashed border-border bg-card/50"
              )}
              role="status"
              aria-label="No skills available"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FolderOpen className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">No skills yet</p>
                <p className="mt-1 text-base text-muted-foreground">
                  Add skills to the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/skills</code> folder to get started.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create <code className="font-mono">skills/my-skill/SKILL.md</code></span>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>
            Skills are compatible with{" "}
            <a
              href="https://docs.claude.com"
              className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm"
            >
              Claude Code
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
