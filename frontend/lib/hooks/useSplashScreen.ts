"use client";

import { useState, useEffect } from "react";
import type { SplashPhase, TransformTarget } from "@/types/splash.types";
import {
  SPLASH_SESSION_KEY,
  TOTAL_SHIMMER_SEC,
  HOLD_AFTER_SHIMMER_SEC,
  TOTAL_SPLASH_MS,
} from "@/constants/splash.constants";

export function useSplashScreen(
  onComplete: () => void,
  onTranslateStart?: () => void,
): {
  phase: SplashPhase;
  transformTarget: TransformTarget;
} {
  const [phase, setPhase] = useState<SplashPhase>("shimmer");
  const [transformTarget, setTransformTarget] = useState<TransformTarget>({
    x: typeof window !== "undefined" ? -window.innerWidth / 2 + 160 : -400,
    y: typeof window !== "undefined" ? -window.innerHeight / 2 + 60 : -300,
    scale: 0.25,
  });

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_SESSION_KEY)) {
        queueMicrotask(() => {
          setPhase("done");
          onComplete();
        });
        return;
      }
    } catch {
      // sessionStorage unavailable — play anyway
    }

    const t1 = setTimeout(
      () => {
        try {
          const headerEl = document.getElementById("header-argus-logo");
          const splashEl = document.getElementById("splash-logo-container");
          if (headerEl && splashEl) {
            const targetRect = headerEl.getBoundingClientRect();
            const startRect = splashEl.getBoundingClientRect();

            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;
            const startX = startRect.left + startRect.width / 2;
            const startY = startRect.top + startRect.height / 2;

            setTransformTarget({
              x: targetX - startX,
              y: targetY - startY,
              scale: targetRect.width / startRect.width,
            });
          }
        } catch {
          // use default
        }
        if (onTranslateStart) onTranslateStart();
        setPhase("translate");
      },
      (TOTAL_SHIMMER_SEC + HOLD_AFTER_SHIMMER_SEC) * 1000,
    );

    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
      try {
        sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, TOTAL_SPLASH_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete, onTranslateStart]);

  return { phase, transformTarget };
}
