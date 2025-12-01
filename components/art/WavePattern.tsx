"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WavePatternProps {
  className?: string;
  waveCount?: number;
  speed?: number;
}

export function WavePattern({
  className,
  waveCount = 3,
  speed = 0.02,
}: WavePatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

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

    // Theme-aligned wave colors
    const waveColors = [
      { stroke: "rgba(180, 100, 60, 0.08)", amplitude: 40, frequency: 0.008, phase: 0 },
      { stroke: "rgba(140, 100, 180, 0.06)", amplitude: 30, frequency: 0.012, phase: 2 },
      { stroke: "rgba(170, 90, 50, 0.05)", amplitude: 50, frequency: 0.006, phase: 4 },
    ];

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += speed;

      waveColors.slice(0, waveCount).forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.stroke;
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

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [waveCount, speed]);

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
