import { OverallAuditStatus } from "@/types/audit.types";

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(part: number, total: number): string {
  if (!total || total <= 0 || isNaN(part)) return "0%";
  const pct = Math.round((part / total) * 100);
  return `${pct}%`;
}

export function getStatusConfig(status: OverallAuditStatus | string): {
  label: string;
  badgeClass: string;
  borderClass: string;
} {
  switch (status) {
    case "high_savings":
      return {
        label: "High Optimization Potential",
        badgeClass:
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        borderClass:
          "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
      };
    case "moderate_savings":
      return {
        label: "Moderate Savings Found",
        badgeClass:
          "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.2)]",
        borderClass:
          "border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.1)]",
      };
    case "optimal":
    default:
      return {
        label: "Stack is Highly Efficient",
        badgeClass:
          "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
        borderClass:
          "border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
      };
  }
}

export function getActionBadgeClass(action: string): {
  label: string;
  colorClass: string;
} {
  switch (action) {
    case "switch_plan":
      return {
        label: "Switch Plan",
        colorClass:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      };
    case "switch_tool":
      return {
        label: "Switch Tool",
        colorClass:
          "bg-violet-500/15 text-violet-300 border border-violet-500/30",
      };
    case "switch_to_credits":
      return {
        label: "Transition to API",
        colorClass: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
      };
    case "downgrade":
      return {
        label: "Downgrade Tier",
        colorClass: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
      };
    case "keep":
    default:
      return {
        label: "Keep As Is",
        colorClass: "bg-zinc-800 text-zinc-400 border border-zinc-700",
      };
  }
}
