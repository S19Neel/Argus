'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ToolAuditBreakdownDto } from '@/types/audit.types';
import { formatCurrency, getActionBadgeClass } from '@/lib/utils/formatters';
import { Layers, ArrowRight } from 'lucide-react';

interface ToolRecommendationsTableProps {
  toolBreakdowns: ToolAuditBreakdownDto[];
}

export function ToolRecommendationsTable({
  toolBreakdowns,
}: ToolRecommendationsTableProps) {
  return (
    <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <CardHeader className="p-6 border-b border-zinc-800/80">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Defensible Itemized Recommendations by Pillar
        </CardTitle>
        <p className="text-xs text-zinc-400 mt-1">
          Each recommendation maintains 100% engineering output while eliminating structural tier overkill.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-950/80 border-b border-zinc-800">
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead className="text-xs font-semibold uppercase text-zinc-400 py-4 px-6">
                  Analyzed Tool & Tier
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-zinc-400 py-4">
                  Current vs Optimized
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-zinc-400 py-4">
                  Action & Target
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-zinc-400 py-4">
                  Monthly Savings
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-zinc-400 py-4 px-6">
                  Defensible Architectural Rationale
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolBreakdowns.map((item, index) => {
                const actionBadge = getActionBadgeClass(item.recommendedAction);
                const isSavings = item.monthlySavings > 0;

                return (
                  <TableRow
                    key={index}
                    className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
                  >
                    <TableCell className="py-4 px-6 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{item.toolName}</span>
                        <span className="text-xs text-zinc-400">
                          Tier: {item.currentPlan}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 font-mono">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-400">
                          {formatCurrency(item.currentSpend)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="font-bold text-emerald-400">
                          {formatCurrency(item.estimatedMonthlyCost)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2.5 py-0.5 rounded-md ${actionBadge.colorClass}`}
                        >
                          {actionBadge.label}
                        </Badge>
                        <p className="text-xs text-zinc-300">
                          {item.recommendedPlanOrTool}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 font-mono">
                      <span
                        className={`text-sm font-bold ${
                          isSavings ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                      >
                        {isSavings
                          ? `+${formatCurrency(item.monthlySavings)}/mo`
                          : '$0/mo'}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 px-6 text-xs text-zinc-300 leading-relaxed max-w-md">
                      {item.reason}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
