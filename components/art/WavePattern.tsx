"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface WavePatternProps {
  className?: string;
  waveCount?: number;
  speed?: number;
}

function getCanvasColor(variable: string, alpha: number): string {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return `rgba(${rgb}, ${alpha})`;
}

interface WaveConfig {
  colorVar: string;
  alpha: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

export function WavePattern({
  className,
  waveCount = 3,
  speed = 0.02,
}: WavePatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const waveConfigs = useRef<WaveConfig[]>([
    { colorVar: "--chart-1-rgb", alpha: 0.08, amplitude: 40, frequency: 0.008, phase: 0 },
    { colorVar: "--chart-2-rgb", alpha: 0.06, amplitude: 30, frequency: 0.012, phase: 2 },
    { colorVar: "--chart-5-rgb", alpha: 0.05, amplitude: 50, frequency: 0.006, phase: 4 },
  ]);

  const getWaveColor = useCallback((config: WaveConfig): string => {
    return getCanvasColor(config.colorVar, config.alpha);
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

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += speed;

      waveConfigs.current.slice(0, waveCount).forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = getWaveColor(wave);
        ctx.lineWidth = 2;

        const baseY = rect.height * (0.3 + index * 0.2);

        for (let x = 0; x <= rect.width; x += 2) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + timeRef.current + wave.phase) *
              wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + timeRef.current * 0.7) *
              (wave.amplitude * 0.5);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
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
  }, [waveCount, speed, getWaveColor]);

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
