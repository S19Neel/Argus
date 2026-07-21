"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { ArgusLogo } from "@/components/common/ArgusLogo";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { ShieldCheck, Cpu, Layers } from "lucide-react";

const StackBuilderForm = dynamic(
  () =>
    import("@/components/audit/StackBuilderForm").then(
      (mod) => mod.StackBuilderForm,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-5xl mx-auto h-96 rounded-2xl bg-zinc-900/40 animate-pulse" />
    ),
  },
);

export function HomeClientContent() {
  const [splashDone, setSplashDone] = useState(false);
  const [splashTranslating, setSplashTranslating] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  const handleSplashTranslateStart = useCallback(() => {
    setSplashTranslating(true);
  }, []);

  return (
    <>
      <SplashScreen
        onComplete={handleSplashComplete}
        onTranslateStart={handleSplashTranslateStart}
      />

      <main
        className={`min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#060a12] to-black transition-opacity duration-700 ${
          splashTranslating || splashDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full space-y-14 relative z-10">
          <div className="flex items-center gap-3 pt-2">
            <ArgusLogo
              id="header-argus-logo"
              className={
                splashDone
                  ? "opacity-100 transition-opacity duration-300"
                  : "opacity-0"
              }
            />
            <span
              className={`text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium transition-opacity duration-500 ${
                splashDone ? "opacity-100" : "opacity-0"
              }`}
            >
              Architecture Auditor
            </span>
          </div>

          <div className="text-center space-y-7 max-w-3xl mx-auto pt-2">
            <SlideUp delay={0.1}>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Eliminate Architectural Waste across your{" "}
                <span className="text-gradient-emerald">AI Tool Stack</span>
              </h1>
            </SlideUp>

            <SlideUp delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal max-w-2xl mx-auto">
                Defensible spend audits for engineering organizations. Evaluate
                seat overkill, annual billing discounts, retail vs direct API
                parity, and domain-specific tool redundancy without sacrificing
                developer productivity.
              </p>
            </SlideUp>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
              <StaggerItem>
                <div className="p-4 rounded-xl glass-card glow-hover flex items-center gap-3 group">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-zinc-300 font-medium">
                    100% Defensible Math & Capability Parity
                  </span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-4 rounded-xl glass-card glow-hover flex items-center gap-3 group">
                  <Cpu className="w-5 h-5 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-zinc-300 font-medium">
                    OpenAI `gpt-4o-mini` Executive Synthesis
                  </span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-4 rounded-xl glass-card glow-hover flex items-center gap-3 group">
                  <Layers className="w-5 h-5 text-violet-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-zinc-300 font-medium">
                    Multi-Pillar Tool & Tier Recommendations
                  </span>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          <SlideUp delay={0.3}>
            <StackBuilderForm />
          </SlideUp>
        </div>

        <FadeIn>
          <footer className="max-w-6xl mx-auto w-full pt-16 pb-8 border-t border-zinc-800/40 mt-20 text-center text-xs text-zinc-500 space-y-2 relative z-10">
            <p>
              Argus AI Architectural Audit Engine — Built for TechVruk Round 1
              Evaluation.
            </p>
            <p className="text-zinc-600">
              All recommendations strictly verify current pricing data
              (`PRICING_DATA.md`) across 10 core tools.
            </p>
          </footer>
        </FadeIn>
      </main>
    </>
  );
}
