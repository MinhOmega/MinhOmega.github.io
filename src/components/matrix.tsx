"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface MatrixProps {
  className?: string;
}

// Japanese Katakana characters range
const KATAKANA_START = 0x30A0;
const KATAKANA_END = 0x30FF;

const getRandomKatakana = () => {
  return String.fromCharCode(
    KATAKANA_START + Math.floor(Math.random() * (KATAKANA_END - KATAKANA_START + 1))
  );
};

// Color configurations for different themes
const themeColors = {
  light: {
    background: "hsl(var(--background))",
    fade: "rgba(255, 255, 255, 0.12)",
    text: [
      "#9333EA", // Purple
      "#2563EB", // Blue
      "#059669", // Green
      "#DC2626", // Red
      "#D97706", // Amber
      "#4F46E5", // Indigo
    ]
  },
  dark: {
    background: "hsl(var(--background))",
    fade: "rgba(0, 0, 0, 0.12)",
    text: [
      "#F472B6", // Pink
      "#38BDF8", // Sky
      "#4ADE80", // Green
      "#FB923C", // Orange
      "#A78BFA", // Purple
      "#60A5FA", // Blue
    ]
  }
};

export const Matrix = ({ className }: MatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme = 'light' } = useTheme();
  const colors = themeColors[theme as keyof typeof themeColors];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      return { width, height };
    };

    // Initial size setup
    const { width, height } = updateCanvasSize();

    // Matrix configuration
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    // Configure text rendering
    ctx.font = `${fontSize}px "Hiragino Sans", "MS Gothic", monospace`;
    ctx.textAlign = "center";

    // Animation loop
    const interval = setInterval(() => {
      // Apply fade effect
      ctx.fillStyle = colors.fade;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        // Get random character and color
        const char = getRandomKatakana();
        const x = i * fontSize + fontSize/2;
        const y = drops[i] * fontSize;
        
        // Create gradient for each character
        const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
        const color = colors.text[Math.floor(Math.random() * colors.text.length)];
        
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(0.5, `${color}FF`);
        gradient.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = gradient;
        ctx.fillText(char, x, y);

        // Reset drop when it reaches bottom
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    }, 50);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [theme, colors]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "w-full h-[200px] transition-colors duration-300",
        theme === 'dark' ? 'bg-black/20' : 'bg-white/20',
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}; 