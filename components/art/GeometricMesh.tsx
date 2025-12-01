"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

interface GeometricMeshProps {
  className?: string;
  pointCount?: number;
  connectionDistance?: number;
}

function getCanvasColor(variable: string, alpha: number): string {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return `rgba(${rgb}, ${alpha})`;
}

export function GeometricMesh({
  className,
  pointCount = 50,
  connectionDistance = 150,
}: GeometricMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>(0);

  const getLineColor = useCallback((opacity: number): string => {
    return getCanvasColor("--chart-1-rgb", opacity);
  }, []);

  const getPointColor = useCallback((): string => {
    return getCanvasColor("--chart-2-rgb", 0.3);
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
      initPoints();
    };

    const initPoints = () => {
      const rect = canvas.getBoundingClientRect();
      pointsRef.current = Array.from({ length: pointCount }, () => {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        return {
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        };
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update points
      pointsRef.current.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        // Soft boundary - reverse when too far from origin
        const dx = point.x - point.originX;
        const dy = point.y - point.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 50) {
          point.vx -= dx * 0.001;
          point.vy -= dy * 0.001;
        }

        // Keep in bounds
        if (point.x < 0 || point.x > rect.width) point.vx *= -1;
        if (point.y < 0 || point.y > rect.height) point.vy *= -1;
      });

      // Draw connections with theme-aware colors
      pointsRef.current.forEach((point, i) => {
        pointsRef.current.slice(i + 1).forEach((other) => {
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = getLineColor(opacity);
            ctx.lineWidth = 1;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw points with theme-aware colors
      const pointColor = getPointColor();
      pointsRef.current.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = pointColor;
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Theme reactivity: colors are read fresh in animate loop
    const observer = new MutationObserver(() => {
      // Colors are read fresh in animate loop
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
  }, [pointCount, connectionDistance, getLineColor, getPointColor]);

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
