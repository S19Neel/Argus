"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToolAuditBreakdownDto } from "@/types/audit.types";
import { formatCurrency, getActionBadgeClass } from "@/lib/utils/formatters";
import { Layers, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { motion } from "framer-motion";

interface ToolRecommendationsTableProps {
  toolBreakdowns: ToolAuditBreakdownDto[];
}

export const ToolRecommendationsTable = memo(
  function ToolRecommendationsTable({
    toolBreakdowns,
  }: ToolRecommendationsTableProps) {
    return (
      <FadeIn>
        <Card className="glass-card glow-hover rounded-2xl shadow-xl overflow-hidden transition-all">
          <CardHeader className="p-6 border-b border-white/6">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Defensible Itemized Recommendations by Pillar
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              Each recommendation maintains 100% engineering output while
              eliminating structural tier overkill.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-950/40 border-b border-white/6">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="w-[18%] text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 py-4 px-6">
                      Analyzed Tool & Tier
                    </TableHead>
                    <TableHead className="w-[16%] text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 py-4">
                      Current vs Optimized
                    </TableHead>
                    <TableHead className="w-[18%] text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 py-4">
                      Action & Target
                    </TableHead>
                    <TableHead className="w-[13%] text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 py-4">
                      Monthly Savings
                    </TableHead>
                    <TableHead className="w-[35%] text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 py-4 px-6">
                      Defensible Architectural Rationale
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toolBreakdowns.map((item, index) => {
                    const actionBadge = getActionBadgeClass(
                      item.recommendedAction,
                    );
                    const isSavings = item.monthlySavings > 0;

                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.06,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="border-b border-white/4 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="py-4 px-6 font-medium text-white align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              {item.toolName}
                            </span>
                            <span className="text-xs text-zinc-500">
                              Tier: {item.currentPlan}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 font-mono align-top">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-400">
                              {formatCurrency(item.currentSpend)}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <span className="font-bold text-emerald-400">
                              {formatCurrency(item.estimatedMonthlyCost)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top">
                          <div className="space-y-1.5">
                            <Badge
                              variant="outline"
                              className={`text-xs px-2.5 py-0.5 rounded-md ${actionBadge.colorClass}`}
                            >
                              {actionBadge.label}
                            </Badge>
                            <p className="text-xs text-zinc-300 font-medium">
                              {item.recommendedPlanOrTool}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 font-mono align-top">
                          <span
                            className={`text-sm font-bold ${
                              isSavings ? "text-emerald-400" : "text-zinc-500"
                            }`}
                          >
                            {isSavings
                              ? `+${formatCurrency(item.monthlySavings)}/mo`
                              : "$0/mo"}
                          </span>
                        </TableCell>

                        <TableCell className="py-4 px-6 text-xs text-zinc-300 leading-relaxed whitespace-normal break-words align-top">
                          <div className="whitespace-normal break-words leading-relaxed min-w-[240px]">
                            {item.reason}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    );
  },
);
