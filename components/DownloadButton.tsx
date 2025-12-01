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
