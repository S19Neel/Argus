"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useCountUp(
  target: number,
  duration = 1200,
): { value: number; ref: RefObject<HTMLDivElement | null> } {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}
