"use client";

import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CHART_COLORS } from "@/constants/audit.constants";
import { formatCurrency } from "@/lib/utils/formatters";
import type { SpendComparisonChartsProps } from "@/types/components.types";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-[#0e121c] border border-white/10 p-3 rounded-lg shadow-xl font-mono text-xs">
        <p className="text-white font-bold mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="my-0.5">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload[0]) {
    const data = payload[0];
    return (
      <div className="bg-[#0e121c] border border-white/10 p-3 rounded-lg shadow-xl font-mono text-xs">
        <p className="text-white font-bold">{data.name}</p>
        <p className="text-emerald-400 mt-1">
          Savings: {formatCurrency(data.value)}/mo
        </p>
      </div>
    );
  }
  return null;
}

export const SpendComparisonCharts = memo(function SpendComparisonCharts({
  toolBreakdowns,
}: SpendComparisonChartsProps) {
  const barData = useMemo(
    () =>
      toolBreakdowns.map((t) => ({
        toolName:
          t.toolName.length > 12 ? t.toolName.slice(0, 12) + "..." : t.toolName,
        Current: Number(t.currentSpend) || 0,
        Recommended: Number(t.estimatedMonthlyCost) || 0,
      })),
    [toolBreakdowns],
  );

  const pieData = useMemo(
    () =>
      toolBreakdowns
        .filter((t) => (Number(t.monthlySavings) || 0) > 0)
        .map((t) => ({
          name: t.toolName,
          value: Number(t.monthlySavings) || 0,
        })),
    [toolBreakdowns],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-7 bg-[#0e121c]/80 border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-heading text-white">
            Current vs. Optimized Monthly Spend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="toolName"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(val: number) => `$${val}`}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <Bar
                dataKey="Current"
                fill="#3f3f46"
                radius={[4, 4, 0, 0]}
                name="Current Spend"
              />
              <Bar
                dataKey="Recommended"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Optimized Spend"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-5 bg-[#0e121c]/80 border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-heading text-white">
            Savings Distribution by Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          {pieData.length === 0 ? (
            <div className="text-center font-mono text-zinc-500 text-sm">
              No immediate cost reduction targets identified.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="rgba(14,18,28,0.8)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
