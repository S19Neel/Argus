"use client";

import { memo } from "react";

export const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="relative">
        <div className="w-14 h-14 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <div
          className="absolute inset-0 w-14 h-14 border-2 border-transparent border-b-teal-400/40 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Synthesizing Architectural Findings...
        </h2>
        <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
          Verifying seat overkill rules, calculating annual run-rate discounts,
          and generating AI executive analysis.
        </p>
      </div>
    </div>
  );
});
