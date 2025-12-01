import { notFound } from "next/navigation";
import Link from "next/link";
import { getSkillBySlug, getSkillSlugs } from "@/lib/skills";
import { DownloadButton } from "@/components/DownloadButton";
import { CopyCommand } from "@/components/CopyCommand";
import { GridPattern } from "@/components/GridPattern";
import { WavePattern } from "@/components/art";
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

  const iconName = toPascalCase(skill.icon);
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      iconName
    ] || LucideIcons.FileText;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Algorithmic Art Background */}
      <GridPattern variant="crosses" className="opacity-60" />
      <WavePattern waveCount={3} speed={0.015} />

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
