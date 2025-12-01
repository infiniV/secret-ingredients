"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface FloatingOrbsProps {
  className?: string;
  orbCount?: number;
}

export function FloatingOrbs({ className, orbCount = 5 }: FloatingOrbsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number>(0);

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

    // Theme-aligned colors (warm oranges, purples, creams)
    const colors = [
      "rgba(180, 100, 60, 0.15)",   // chart-1 warm orange
      "rgba(140, 100, 180, 0.12)",  // chart-2 purple
      "rgba(220, 200, 170, 0.1)",   // chart-3 cream
      "rgba(180, 160, 200, 0.1)",   // chart-4 lavender
      "rgba(170, 90, 50, 0.12)",    // chart-5 deep orange
    ];

    // Initialize orbs
    const rect = canvas.getBoundingClientRect();
    orbsRef.current = Array.from({ length: orbCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 80 + Math.random() * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
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

        // Draw orb with radial gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [orbCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
    />
  );
}
