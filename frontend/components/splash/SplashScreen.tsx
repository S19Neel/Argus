"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSplashScreen } from "@/lib/hooks/useSplashScreen";
import {
  SPLASH_LETTERS,
  LETTER_STAGGER_SEC,
  SHIMMER_DURATION_SEC,
  TRANSLATE_DURATION_SEC,
} from "@/constants/splash.constants";
import type { SplashScreenProps } from "@/types/splash.types";

export const SplashScreen = memo(function SplashScreen({
  onComplete,
  onTranslateStart,
}: SplashScreenProps) {
  const { phase, transformTarget } = useSplashScreen(
    onComplete,
    onTranslateStart,
  );

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
        transition={{ duration: TRANSLATE_DURATION_SEC, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[160px] pointer-events-none"
          animate={{
            scale: phase === "translate" ? 0.3 : 1,
            opacity: phase === "translate" ? 0 : 0.6,
          }}
          transition={{ duration: TRANSLATE_DURATION_SEC, ease: "easeInOut" }}
        />

        <motion.div
          id="splash-logo-container"
          className="flex items-center gap-[2px] select-none origin-center"
          animate={
            phase === "translate"
              ? {
                  x: transformTarget.x,
                  y: transformTarget.y,
                  scale: transformTarget.scale,
                }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={{
            duration: TRANSLATE_DURATION_SEC,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {SPLASH_LETTERS.map((letter, i) => (
            <motion.span
              key={letter + i}
              className="inline-block text-7xl sm:text-8xl md:text-9xl font-heading font-bold tracking-[0.08em] text-white/10 relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * LETTER_STAGGER_SEC,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <span className="relative z-10">{letter}</span>

              <motion.span
                className="absolute inset-0 z-20 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: i * LETTER_STAGGER_SEC + 0.2,
                  duration: SHIMMER_DURATION_SEC,
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

              <motion.span
                className="absolute inset-0 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * LETTER_STAGGER_SEC + SHIMMER_DURATION_SEC,
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
});
