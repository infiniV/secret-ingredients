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
