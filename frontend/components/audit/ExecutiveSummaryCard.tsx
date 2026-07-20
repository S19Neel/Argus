"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { ScaleIn } from "@/components/motion";

interface ExecutiveSummaryCardProps {
  summaryParagraph?: string | null;
}

export const ExecutiveSummaryCard = memo(function ExecutiveSummaryCard({
  summaryParagraph,
}: ExecutiveSummaryCardProps) {
  if (!summaryParagraph) return null;

  return (
    <ScaleIn>
      <Card className="glass-card border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.08)] rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/6 rounded-full blur-[80px] pointer-events-none" />
        <CardContent className="p-8 relative z-10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Executive AI Architectural Synthesis
                </h3>
                <p className="text-xs text-zinc-500">
                  Synthesized by Argus Engine (`gpt-4o-mini` with defensible
                  structural rules)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Capability Parity
            </div>
          </div>

          <div className="pt-2">
            <p className="text-base sm:text-lg leading-relaxed text-zinc-300 font-normal tracking-wide">
              &ldquo;{summaryParagraph}&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
});
