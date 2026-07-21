"use client";

import { memo } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getActionBadgeClass } from "@/lib/utils/formatters";
import type { ToolRecommendationsTableProps } from "@/types/components.types";

export const ToolRecommendationsTable = memo(function ToolRecommendationsTable({
  toolBreakdowns,
}: ToolRecommendationsTableProps) {
  return (
    <div className="rounded-2xl bg-[#0e121c]/80 border border-white/10 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-white">
            Itemized Architectural Recommendations
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Detailed breakdown of tier consolidation and API transition
            opportunities
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#161d2d]/60 border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Tool & Current Tier
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Recommended Action
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Target Architecture
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-zinc-400 text-right">
                Current Spend
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-zinc-400 text-right">
                Optimized
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-wider text-emerald-400 text-right">
                Monthly Savings
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {toolBreakdowns.map((item, idx) => {
              const badge = getActionBadgeClass(item.recommendedAction);
              return (
                <TableRow
                  key={idx}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell className="font-medium text-white py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold">
                        {item.toolName}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                        {item.currentPlan}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-medium ${badge.colorClass}`}
                    >
                      {badge.label}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-zinc-200 font-medium text-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.recommendedPlanOrTool}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.reason}
                    </p>
                  </TableCell>

                  <TableCell className="text-right font-mono text-zinc-300 py-4">
                    {formatCurrency(item.currentSpend)}
                  </TableCell>

                  <TableCell className="text-right font-mono text-zinc-300 py-4">
                    {formatCurrency(item.estimatedMonthlyCost)}
                  </TableCell>

                  <TableCell className="text-right py-4">
                    {item.monthlySavings > 0 ? (
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                        +{formatCurrency(item.monthlySavings)}
                      </span>
                    ) : (
                      <span className="font-mono text-zinc-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                        Optimal
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
