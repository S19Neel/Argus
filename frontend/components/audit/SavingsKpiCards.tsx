"use client";

import { memo } from "react";
import { TrendingDown, PiggyBank, Award, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { formatCurrency, getStatusConfig } from "@/lib/utils/formatters";
import type { SavingsKpiCardsProps } from "@/types/components.types";

export const SavingsKpiCards = memo(function SavingsKpiCards({
  totalMonthlySavings,
  totalAnnualSavings,
  overallStatus,
  totalCurrentMonthlySpend,
}: SavingsKpiCardsProps) {
  const { value: animatedMonthlySavings, ref: monthlyRef } =
    useCountUp(totalMonthlySavings);
  const { value: animatedAnnualSavings, ref: annualRef } =
    useCountUp(totalAnnualSavings);

  const statusConfig = getStatusConfig(overallStatus);
  const reductionPct =
    totalCurrentMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-[#0e121c]/80 border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Estimated Monthly Savings
              </span>
              <div
                ref={monthlyRef}
                className="text-3xl lg:text-4xl font-heading font-bold text-white font-mono mt-1 tracking-tight"
              >
                {formatCurrency(animatedMonthlySavings)}
                <span className="text-xs font-sans text-zinc-500 font-normal ml-1">
                  /mo
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          {reductionPct > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md w-fit">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{reductionPct}% reduction from current spend</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0e121c]/80 border-white/10 relative overflow-hidden group hover:border-teal-500/30 transition-all shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-teal-500/10 transition-all" />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Annual Run-Rate Impact
              </span>
              <div
                ref={annualRef}
                className="text-3xl lg:text-4xl font-heading font-bold text-teal-400 font-mono mt-1 tracking-tight"
              >
                {formatCurrency(animatedAnnualSavings)}
                <span className="text-xs font-sans text-zinc-500 font-normal ml-1">
                  /yr
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <PiggyBank className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Compound capital unlocked for R&D reallocation
          </p>
        </CardContent>
      </Card>

      <Card
        className={`bg-[#0e121c]/80 border relative overflow-hidden transition-all shadow-lg ${statusConfig.borderClass}`}
      >
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                Stack Health Rating
              </span>
              <div className="mt-2.5">
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg font-heading font-bold text-sm tracking-wide uppercase ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Based on seat utilization vs tier requirements
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
