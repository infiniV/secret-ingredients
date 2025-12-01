import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  variant?: "dots" | "lines" | "crosses";
}

export function GridPattern({ className, variant = "dots" }: GridPatternProps) {
  const patternId = `grid-pattern-${variant}`;
  const maskId = `fade-mask-${variant}`;
  const gradientId = `fade-gradient-${variant}`;

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {variant === "dots" && (
          <pattern
            id={patternId}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="16" cy="16" r="1.5" className="fill-primary/20" />
          </pattern>
        )}

        {variant === "lines" && (
          <pattern
            id={patternId}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
              className="stroke-primary/10"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        )}

        {variant === "crosses" && (
          <pattern
            id={patternId}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 20v8M20 24h8"
              className="stroke-primary/15"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </pattern>
        )}

        {/* Use CSS variable for theme-aware gradient mask */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--background)" }} stopOpacity="1" />
          <stop offset="60%" style={{ stopColor: "var(--background)" }} stopOpacity="0.6" />
          <stop offset="100%" style={{ stopColor: "var(--background)" }} stopOpacity="0" />
        </linearGradient>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
