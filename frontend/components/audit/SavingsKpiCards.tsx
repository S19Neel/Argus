"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusConfig } from "@/lib/utils/formatters";
import {
  DollarSign,
  TrendingDown,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

/* Animated counter hook — counts up from 0 to target */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

interface SavingsKpiCardsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: string;
  totalCurrentMonthlySpend: number;
}

export const SavingsKpiCards = memo(function SavingsKpiCards({
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

  const monthlyCounter = useCountUp(totalMonthlySavings);
  const annualCounter = useCountUp(totalAnnualSavings);

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Savings Card */}
      <StaggerItem>
        <Card className="glass-card glow-hover rounded-2xl p-6 relative overflow-hidden group transition-all duration-400 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/6 rounded-full blur-[60px] group-hover:bg-emerald-500/12 transition-all duration-500" />
          <CardContent className="p-0 space-y-4" ref={monthlyCounter.ref}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-zinc-500">
                Identified Monthly Waste
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">
                  {formatCurrency(monthlyCounter.value)}
                </span>
                <span className="text-xs font-medium text-zinc-500">/mo</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
                <Badge className="bg-emerald-500/15 text-emerald-300 border-none text-[10px]">
                  {monthlySavingsPct}% Reduction
                </Badge>
                from current monthly rate
              </p>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Annual Run-rate Savings Card */}
      <StaggerItem>
        <Card className="glass-card glow-hover rounded-2xl p-6 relative overflow-hidden group transition-all duration-400 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/6 rounded-full blur-[60px] group-hover:bg-teal-500/12 transition-all duration-500" />
          <CardContent className="p-0 space-y-4" ref={annualCounter.ref}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-zinc-500">
                Annualized Bottom-Line Impact
              </span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold font-mono text-teal-300">
                  {formatCurrency(annualCounter.value)}
                </span>
                <span className="text-xs font-medium text-zinc-500">/yr</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Capital unlocked for core developer headcount & API scaling
              </p>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Stack Efficiency Pillar Card */}
      <StaggerItem>
        <Card
          className={`glass-card glow-hover rounded-2xl p-6 relative overflow-hidden transition-all duration-400 shadow-xl ${statusConfig.borderClass}`}
        >
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-zinc-500">
                Stack Efficiency Index
              </span>
              <div className="p-2 rounded-xl bg-zinc-800/60 text-zinc-300 border border-white/8">
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
              <p className="text-xs text-zinc-500 leading-relaxed">
                {overallStatus === "optimal"
                  ? "Your organization is already operating with high seat tier efficiency and zero critical structural waste."
                  : "Defensible optimization rules triggered across your licensing tiers, billing cycles, or retail allocations."}
              </p>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Dynamic Situational TechVruk Intervention Banner */}
      <StaggerItem className="col-span-1 md:col-span-3">
        {totalMonthlySavings >= 500 ? (
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-teal-950/40 border border-emerald-500/25 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-emerald-500/15 text-emerald-400 text-xs">
                  🚀 HIGH SAVINGS ALERT
                </span>
                <span>
                  High-Impact Architectural Intervention Required (
                  {formatCurrency(totalMonthlySavings)}/mo variance)
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
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
          <div className="p-5 rounded-xl glass-card text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-teal-500/15 text-teal-300 text-xs">
                  💡 MODERATE OPTIMIZATION
                </span>
                <span>
                  Recoverable Run-Rate Variance (
                  {formatCurrency(totalMonthlySavings)}/mo)
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-3xl">
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
          <div className="p-5 rounded-xl glass-card text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="p-1 rounded bg-amber-500/15 text-amber-300 text-xs">
                  ✅ OPTIMAL STACK
                </span>
                <span>
                  Verified High-Efficiency Allocation (
                  {formatCurrency(totalMonthlySavings)}/mo variance)
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-3xl">
                Your engineering organization is maintaining defensible,
                high-efficiency AI tool licensing without overpaying on retail
                tier multipliers or redundant seat allocations.
              </p>
            </div>
          </div>
        )}
      </StaggerItem>
    </StaggerContainer>
  );
});
