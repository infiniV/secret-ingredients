"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <div
        className="flex items-center gap-1 rounded-full bg-muted p-1"
        role="group"
        aria-label="Theme selection"
      >
        <div className="h-10 w-10" aria-hidden="true" />
        <div className="h-10 w-10" aria-hidden="true" />
        <div className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  const themes = [
    { value: "light", label: "Light mode", icon: Sun },
    { value: "system", label: "System theme", icon: Monitor },
    { value: "dark", label: "Dark mode", icon: Moon },
  ] as const;

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-muted p-1"
      role="group"
      aria-label="Theme selection"
    >
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
