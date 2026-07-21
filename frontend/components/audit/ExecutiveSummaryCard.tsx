"use client";

import { memo } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ExecutiveSummaryCardProps } from "@/types/components.types";

export const ExecutiveSummaryCard = memo(function ExecutiveSummaryCard({
  summaryParagraph,
}: ExecutiveSummaryCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#0e121c] via-[#111726] to-[#0e121c] border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-bold text-white flex items-center gap-2">
              AI Stack Executive Summary
              <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                ARGUS VERIFIED
              </span>
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              Generated via multi-agent over-provisioning analysis
            </p>
          </div>
        </div>

        <div className="text-zinc-300 leading-relaxed text-sm md:text-base space-y-3 font-sans border-l-2 border-emerald-500/40 pl-4 py-1">
          {summaryParagraph ? (
            <p>{summaryParagraph}</p>
          ) : (
            <p className="italic text-zinc-500">
              No executive summary provided.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
