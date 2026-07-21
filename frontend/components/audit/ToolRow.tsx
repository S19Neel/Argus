"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_TOOLS } from "@/constants/pricing.constants";
import { DEFAULT_TOOL_TIERS } from "@/constants/audit.constants";
import { formatCurrency } from "@/lib/utils/formatters";
import type { ToolRowProps } from "@/types/components.types";

export const ToolRow = memo(function ToolRow({
  tool,
  index,
  onToolChange,
  onRemove,
}: ToolRowProps) {
  const currentConfig = SUPPORTED_TOOLS.find(
    (t) => t.toolName === tool.toolName,
  );
  const availableTiers = currentConfig
    ? Object.keys(currentConfig.tiers)
    : DEFAULT_TOOL_TIERS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-[#0e121c]/60 border border-white/[0.04] transition-all hover:border-emerald-500/20 group">
      <div className="md:col-span-4">
        <label className="block md:hidden text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
          Tool Name
        </label>
        <Select
          value={tool.toolName}
          onValueChange={(val: string | null) =>
            val && onToolChange(index, "toolName", val)
          }
        >
          <SelectTrigger className="w-full bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11 cursor-pointer">
            <SelectValue placeholder="Select Tool">
              {tool.toolName || "Select Tool"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#161d2d] border-white/10 text-white">
            {SUPPORTED_TOOLS.map((item) => (
              <SelectItem key={item.toolName} value={item.toolName}>
                {item.toolName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3">
        <label className="block md:hidden text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
          Current Tier
        </label>
        <Select
          value={tool.plan}
          onValueChange={(val: string | null) =>
            val && onToolChange(index, "plan", val)
          }
        >
          <SelectTrigger className="w-full bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11 cursor-pointer">
            <SelectValue placeholder="Select Tier">
              {tool.plan || "Select Tier"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#161d2d] border-white/10 text-white">
            {availableTiers.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <label className="block md:hidden text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
          Active Seats
        </label>
        <Input
          type="number"
          min={1}
          max={10000}
          value={tool.seats}
          onChange={(e) =>
            onToolChange(index, "seats", parseInt(e.target.value, 10) || 1)
          }
          className="bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-11 font-mono cursor-pointer"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block md:hidden text-xs font-mono text-zinc-500 mb-1.5 uppercase tracking-wider">
          Monthly Spend
        </label>
        <div className="h-11 flex items-center px-3 rounded-md bg-white/[0.02] border border-white/5 text-zinc-300 font-mono text-sm cursor-pointer">
          {formatCurrency(tool.currentMonthlySpend)}
        </div>
      </div>

      <div className="md:col-span-1 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 h-9 w-9 cursor-pointer"
          title="Remove Tool"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});
