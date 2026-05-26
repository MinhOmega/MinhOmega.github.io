"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ThemeAnimationType = "circle" | "blur-circle";

interface UseThemeToggleOptions {
  duration?: number;
  easing?: string;
  animationType?: ThemeAnimationType;
  blurAmount?: number;
}

const STYLE_ID = "theme-switch-dynamic-style";

const supportsViewTransitions = () =>
  typeof document !== "undefined" &&
  // @ts-expect-error - startViewTransition is not in the lib.dom yet
  typeof document.startViewTransition === "function";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const buildBlurMask = (blur: number) =>
  `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs><filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter></defs><circle cx="0" cy="0" r="25" fill="white" filter="url(%23blur)"/></svg>')`;

export function useThemeToggle({
  duration = 700,
  easing = "ease-in-out",
  animationType = "circle",
  blurAmount = 2,
}: UseThemeToggleOptions = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const swapTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const toggleTheme = useCallback(async () => {
    if (!ref.current || !supportsViewTransitions() || prefersReducedMotion()) {
      swapTheme();
      return;
    }

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const maxRadius = Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    );

    let injectedStyle: HTMLStyleElement | null = null;

    if (animationType === "blur-circle") {
      const finalMaskSize = maxRadius * 2.5;
      injectedStyle = document.createElement("style");
      injectedStyle.id = STYLE_ID;
      injectedStyle.textContent = `
        ::view-transition-group(root) {
          animation-duration: ${duration}ms;
          animation-timing-function: ${easing};
        }
        ::view-transition-new(root) {
          mask: ${buildBlurMask(blurAmount)} 0 0 / 100% 100% no-repeat;
          animation: theme-mask-scale ${duration}ms ${easing};
          transform-origin: ${x}px ${y}px;
        }
        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: theme-mask-scale ${duration}ms ${easing};
          transform-origin: ${x}px ${y}px;
          z-index: -1;
        }
        @keyframes theme-mask-scale {
          0%   { mask-size: 0px;              mask-position: ${x}px ${y}px; }
          100% { mask-size: ${finalMaskSize}px; mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px; }
        }
      `;
      document.head.appendChild(injectedStyle);
    }

    // @ts-expect-error - startViewTransition is not in the lib.dom yet
    const transition = document.startViewTransition(() => {
      flushSync(swapTheme);
    });

    try {
      await transition.ready;

      if (animationType === "circle") {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing,
            pseudoElement: "::view-transition-new(root)",
          },
        );
      }

      await transition.finished;
    } finally {
      injectedStyle?.remove();
    }
  }, [animationType, blurAmount, duration, easing, swapTheme]);

  return { theme: resolvedTheme, toggleTheme, ref, mounted };
}

export default function ThemeToggler() {
  const { toggleTheme, ref, mounted } = useThemeToggle();

  return (
    <Button
      ref={ref}
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="size-8 p-0"
      aria-label="Toggle theme"
      // Suppress hydration mismatch from the icon — the resolvedTheme is unknown on the server.
      suppressHydrationWarning
    >
      <SunIcon
        size={16}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden={!mounted}
      />
      <MoonIcon
        size={16}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden={!mounted}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
