import { getAllSkills } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { GridPattern } from "@/components/GridPattern";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const skills = getAllSkills();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <GridPattern className="opacity-50" />

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
