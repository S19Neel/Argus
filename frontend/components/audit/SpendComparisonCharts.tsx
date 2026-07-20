"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolAuditBreakdownDto } from "@/types/audit.types";
import { formatCurrency } from "@/lib/utils/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { FadeIn } from "@/components/motion";

interface SpendComparisonChartsProps {
  toolBreakdowns: ToolAuditBreakdownDto[];
}

const COLORS = [
  "#10b981",
  "#14b8a6",
  "#6366f1",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
];

export const SpendComparisonCharts = memo(function SpendComparisonCharts({
  toolBreakdowns,
}: SpendComparisonChartsProps) {
  const barData = toolBreakdowns.map((item) => ({
    name: item.toolName,
    Current: item.currentSpend,
    Optimized: item.estimatedMonthlyCost,
  }));

  const pieData = toolBreakdowns.map((item) => ({
    name: `${item.toolName} (${item.currentPlan})`,
    value: item.currentSpend,
  }));

  return (
    <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Before vs After Spend Bar Chart */}
      <Card className="glass-card glow-hover rounded-2xl p-6 shadow-xl transition-all">
        <CardHeader className="p-0 pb-6 border-b border-white/6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Current vs Optimized Monthly Spend
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              Side-by-side spend comparison before and after structural
              optimization ($ USD)
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                stroke="#a1a1aa"
                tick={{ fill: "#d4d4d8", fontSize: 11 }}
                tickLine={false}
                fontFamily="var(--font-sans)"
              />
              <YAxis
                stroke="#a1a1aa"
                tick={{ fill: "#d4d4d8", fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(14, 18, 28, 0.98)",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "14px",
                  color: "#fff",
                  backdropFilter: "blur(16px)",
                  fontFamily: "var(--font-sans)",
                }}
                labelStyle={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(val: any) => [formatCurrency(Number(val) || 0), ""]}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "11px",
                  fontFamily: "var(--font-sans)",
                }}
                formatter={(value) => <span style={{ color: "#d4d4d8" }}>{value}</span>}
              />
              <Bar
                dataKey="Current"
                fill="#94a3b8"
                name="Current Spend ($/mo)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Optimized"
                fill="#10b981"
                name="Optimized Spend ($/mo)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stack Allocation Pie Chart */}
      <Card className="glass-card glow-hover rounded-2xl p-6 shadow-xl transition-all">
        <CardHeader className="p-0 pb-6 border-b border-white/6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-400" />
              Current Stack Spend Allocation
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              Proportional distribution of current monthly licensing spend
              across tools
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(6,10,18,0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(14, 18, 28, 0.98)",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "14px",
                  color: "#fff",
                  backdropFilter: "blur(16px)",
                  fontFamily: "var(--font-sans)",
                }}
                labelStyle={{ color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(val: any) => [
                  formatCurrency(Number(val) || 0),
                  "Monthly Spend",
                ]}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "11px",
                  fontFamily: "var(--font-sans)",
                }}
                formatter={(value) => <span style={{ color: "#d4d4d8" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </FadeIn>
  );
});
