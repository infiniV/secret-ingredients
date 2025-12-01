"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
}

interface FloatingOrbsProps {
  className?: string;
  orbCount?: number;
}

function getCanvasColor(variable: string, alpha: number): string {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return `rgba(${rgb}, ${alpha})`;
}

export function FloatingOrbs({ className, orbCount = 5 }: FloatingOrbsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number>(0);
  const colorsRef = useRef<{ variable: string; alpha: number }[]>([
    { variable: "--chart-1-rgb", alpha: 0.15 },
    { variable: "--chart-2-rgb", alpha: 0.12 },
    { variable: "--chart-3-rgb", alpha: 0.1 },
    { variable: "--chart-4-rgb", alpha: 0.1 },
    { variable: "--chart-5-rgb", alpha: 0.12 },
  ]);

  const getOrbColor = useCallback((colorIndex: number): string => {
    const colorDef = colorsRef.current[colorIndex];
    return getCanvasColor(colorDef.variable, colorDef.alpha);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize orbs with color index instead of hardcoded color
    const rect = canvas.getBoundingClientRect();
    orbsRef.current = Array.from({ length: orbCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 80 + Math.random() * 120,
      colorIndex: Math.floor(Math.random() * colorsRef.current.length),
    }));

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      orbsRef.current.forEach((orb) => {
        // Update position
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges with padding
        if (orb.x < -orb.radius) orb.x = rect.width + orb.radius;
        if (orb.x > rect.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = rect.height + orb.radius;
        if (orb.y > rect.height + orb.radius) orb.y = -orb.radius;

        // Get current theme color
        const color = getOrbColor(orb.colorIndex);

        // Draw orb with radial gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Theme reactivity: redraw when theme changes
    const observer = new MutationObserver(() => {
      // Colors are read fresh in animate loop via getOrbColor
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [orbCount, getOrbColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
    />
  );
}
