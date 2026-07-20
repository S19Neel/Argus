"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["A", "R", "G", "U", "S"];
const SESSION_KEY = "argus_splash_played";

/* Duration constants (seconds) */
const LETTER_STAGGER = 0.12;
const SHIMMER_DURATION = 0.7;
const HOLD_AFTER_SHIMMER = 0.6;
const TRANSLATE_DURATION = 0.8;
const TOTAL_SHIMMER = LETTERS.length * LETTER_STAGGER + SHIMMER_DURATION;
const TOTAL_SPLASH =
  (TOTAL_SHIMMER + HOLD_AFTER_SHIMMER + TRANSLATE_DURATION) * 1000;

interface SplashScreenProps {
  onComplete: () => void;
  onTranslateStart?: () => void;
}

export function SplashScreen({
  onComplete,
  onTranslateStart,
}: SplashScreenProps) {
  const [phase, setPhase] = useState<"shimmer" | "translate" | "done">(
    "shimmer",
  );
  const [transformTarget, setTransformTarget] = useState({
    x: typeof window !== "undefined" ? -window.innerWidth / 2 + 160 : -400,
    y: typeof window !== "undefined" ? -window.innerHeight / 2 + 60 : -300,
    scale: 0.25,
  });

  useEffect(() => {
    // Check sessionStorage — skip if already played
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setPhase("done");
        onComplete();
        return;
      }
    } catch {
      // sessionStorage unavailable — play anyway
    }

    // Phase 1→2: After shimmer + hold
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
      (TOTAL_SHIMMER + HOLD_AFTER_SHIMMER) * 1000,
    );

    // Phase 2→done: After translate completes
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, TOTAL_SPLASH);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete, onTranslateStart]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="splash-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060a12]"
        animate={{
          backgroundColor:
            phase === "translate" ? "rgba(6, 10, 18, 0)" : "rgba(6, 10, 18, 1)",
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: TRANSLATE_DURATION, ease: "easeInOut" }}
      >
        {/* Ambient glow behind logo */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[160px] pointer-events-none"
          animate={{
            scale: phase === "translate" ? 0.3 : 1,
            opacity: phase === "translate" ? 0 : 0.6,
          }}
          transition={{ duration: TRANSLATE_DURATION, ease: "easeInOut" }}
        />

        <motion.div
          id="splash-logo-container"
          className="flex items-center gap-[2px] select-none origin-center"
          animate={
            phase === "translate" ? transformTarget : { x: 0, y: 0, scale: 1 }
          }
          transition={{
            duration: TRANSLATE_DURATION,
            ease: [0.76, 0, 0.24, 1], // custom cubic-bezier for premium feel
          }}
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={letter + i}
              className="inline-block text-7xl sm:text-8xl md:text-9xl font-heading font-bold tracking-[0.08em] text-white/10 relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * LETTER_STAGGER,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {/* The letter itself */}
              <span className="relative z-10">{letter}</span>

              {/* Shimmer sweep overlay */}
              <motion.span
                className="absolute inset-0 z-20 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: i * LETTER_STAGGER + 0.2,
                  duration: SHIMMER_DURATION,
                  times: [0, 0.1, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                <span
                  className="inline-block text-7xl sm:text-8xl md:text-9xl font-heading font-bold tracking-[0.08em]"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 0%, #10b981 20%, #d4fce0 40%, #ffffff 50%, #d4fce0 60%, #10b981 80%, transparent 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {letter}
                </span>
              </motion.span>

              {/* Persistent glow after shimmer */}
              <motion.span
                className="absolute inset-0 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * LETTER_STAGGER + SHIMMER_DURATION,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <span
                  className="inline-block text-7xl sm:text-8xl md:text-9xl font-heading font-bold tracking-[0.08em]"
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #a7f3d0 50%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {letter}
                </span>
              </motion.span>
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Small logo component for the header after splash completes */
export function ArgusLogo({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <span
      id={id}
      className={`font-heading font-bold tracking-[0.1em] text-xl bg-gradient-to-b from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent select-none inline-block ${className}`}
    >
      ARGUS
    </span>
  );
}
