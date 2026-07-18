import React from 'react';
import { StackBuilderForm } from '@/components/audit/StackBuilderForm';
import { ShieldCheck, Sparkles, Cpu, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#090d16] to-black">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full space-y-12 relative z-10">
        {/* Hero Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Argus Architecture & Spend Auditor — v1.0
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Eliminate Architectural Waste across your{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              AI Tool Stack
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Defensible spend audits for engineering organizations. Evaluate seat overkill,
            annual billing discounts, retail vs direct API parity, and domain-specific
            tool redundancy without sacrificing developer productivity.
          </p>

          {/* Quick Pillar Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">
                100% Defensible Math & Capability Parity
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur flex items-center gap-3">
              <Cpu className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">
                OpenAI `gpt-4o-mini` Executive Synthesis
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur flex items-center gap-3">
              <Layers className="w-5 h-5 text-violet-400 shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">
                Multi-Pillar Tool & Tier Recommendations
              </span>
            </div>
          </div>
        </div>

        {/* Stack Builder Form Component */}
        <StackBuilderForm />
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-16 pb-8 border-t border-zinc-800/60 mt-20 text-center text-xs text-zinc-500 space-y-2 relative z-10">
        <p>
          Argus AI Architectural Audit Engine — Built for TechVruk Round 1 Evaluation.
        </p>
        <p className="text-zinc-600">
          All recommendations strictly verify current pricing data (`PRICING_DATA.md`) across 10 core tools.
        </p>
      </footer>
    </main>
  );
}
