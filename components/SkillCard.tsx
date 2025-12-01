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
  const iconName = toPascalCase(icon);
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      iconName
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
