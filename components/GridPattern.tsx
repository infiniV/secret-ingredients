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
