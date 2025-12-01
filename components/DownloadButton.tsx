"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Check, Loader2, AlertCircle } from "lucide-react";

interface DownloadButtonProps {
  slug: string;
  skillName: string;
}

type DownloadStatus = "idle" | "loading" | "success" | "error";

export function DownloadButton({ slug, skillName }: DownloadButtonProps) {
  const [status, setStatus] = useState<DownloadStatus>("idle");

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
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const statusConfig = {
    idle: {
      icon: <Download className="h-4 w-4" aria-hidden="true" />,
      text: "Download ZIP",
      ariaLabel: `Download ${skillName} as ZIP file`,
    },
    loading: {
      icon: <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />,
      text: "Downloading...",
      ariaLabel: `Downloading ${skillName}`,
    },
    success: {
      icon: <Check className="h-4 w-4" aria-hidden="true" />,
      text: "Downloaded!",
      ariaLabel: `${skillName} downloaded successfully`,
    },
    error: {
      icon: <AlertCircle className="h-4 w-4" aria-hidden="true" />,
      text: "Failed - Try again",
      ariaLabel: `Download failed. Click to retry downloading ${skillName}`,
    },
  };

  const { icon, text, ariaLabel } = statusConfig[status];

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={status === "loading"}
        aria-label={ariaLabel}
        aria-busy={status === "loading"}
        className={cn(
          "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2.5",
          "font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          status === "error"
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
        )}
      >
        {icon}
        <span>{text}</span>
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Download failed. Please try again.
        </p>
      )}
      {status === "success" && (
        <p role="status" className="sr-only">
          {skillName} downloaded successfully
        </p>
      )}
    </div>
  );
}
