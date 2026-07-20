"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusConfig } from "@/lib/utils/formatters";
import {
  DollarSign,
  TrendingDown,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

interface SavingsKpiCardsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: string;
  totalCurrentMonthlySpend: number;
}

export function SavingsKpiCards({
  totalMonthlySavings,
  totalAnnualSavings,
  overallStatus,
  totalCurrentMonthlySpend,
}: SavingsKpiCardsProps) {
  const statusConfig = getStatusConfig(overallStatus);
  const monthlySavingsPct =
    totalCurrentMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Savings Card */}
      <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
              Identified Monthly Waste
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                {formatCurrency(totalMonthlySavings)}
              </span>
              <span className="text-xs font-medium text-zinc-400">/mo</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                {monthlySavingsPct}% Reduction
              </Badge>
              from current monthly rate
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Annual Run-rate Savings Card */}
      <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
              Annualized Bottom-Line Impact
            </span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-300">
                {formatCurrency(totalAnnualSavings)}
              </span>
              <span className="text-xs font-medium text-zinc-400">/yr</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Capital unlocked for core developer headcount & API scaling
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stack Efficiency Pillar Card */}
      <Card
        className={`bg-zinc-900/70 border backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-xl ${statusConfig.borderClass}`}
      >
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400">
              Stack Efficiency Index
            </span>
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700">
              {overallStatus === "optimal" ? (
                <CheckCircle className="w-4 h-4 text-amber-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>
          <div className="space-y-3 pt-1">
            <Badge
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.badgeClass}`}
            >
              {statusConfig.label}
            </Badge>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {overallStatus === "optimal"
                ? "Your organization is already operating with high seat tier efficiency and zero critical structural waste."
                : "Defensible optimization rules triggered across your licensing tiers, billing cycles, or retail allocations."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Situational TechVruk Intervention Banner */}
      <div className="col-span-1 md:col-span-3">
        {totalMonthlySavings >= 500 ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-900/90 to-teal-950/60 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                  🚀 HIGH SAVINGS ALERT
                </span>
                <span>
                  High-Impact Architectural Intervention Required (
                  {formatCurrency(totalMonthlySavings)}/mo variance)
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                Because your audit identified significant structural tier
                overkill or retail API leakage, a senior solutions architect
                from{" "}
                <strong className="text-white">TechVruk Engineering</strong> can
                directly assist your team with custom enterprise credit
                pipelines and direct vendor volume negotiations.
              </p>
            </div>
          </div>
        ) : totalMonthlySavings >= 100 ? (
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-teal-500/20 text-teal-300 text-xs">
                  💡 MODERATE OPTIMIZATION
                </span>
                <span>
                  Recoverable Run-Rate Variance (
                  {formatCurrency(totalMonthlySavings)}/mo)
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Easily recover{" "}
                <strong className="text-teal-300">
                  {formatCurrency(totalAnnualSavings)}
                </strong>{" "}
                annually by switching to annual billing schedules or removing
                underutilized seats across your secondary AI tools.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-amber-500/20 text-amber-300 text-xs">
                  ✅ OPTIMAL STACK
                </span>
                <span>
                  Verified High-Efficiency Allocation (
                  {formatCurrency(totalMonthlySavings)}/mo variance)
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Your engineering organization is maintaining defensible,
                high-efficiency AI tool licensing without overpaying on retail
                tier multipliers or redundant seat allocations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
