'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  summaryParagraph?: string | null;
}

export function ExecutiveSummaryCard({
  summaryParagraph,
}: ExecutiveSummaryCardProps) {
  if (!summaryParagraph) return null;

  return (
    <Card className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.12)] backdrop-blur-xl rounded-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <CardContent className="p-8 relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Executive AI Architectural Synthesis
              </h3>
              <p className="text-xs text-zinc-400">
                Synthesized by Argus Engine (`gpt-4o-mini` with defensible structural rules)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Capability Parity
          </div>
        </div>

        <div className="pt-2">
          <p className="text-base sm:text-lg leading-relaxed text-zinc-200 font-normal tracking-wide bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text">
            &ldquo;{summaryParagraph}&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
