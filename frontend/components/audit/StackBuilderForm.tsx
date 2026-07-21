"use client";

import { memo } from "react";
import { Plus, Sparkles, RotateCcw, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USE_CASES } from "@/constants/pricing.constants";
import { ToolRow } from "./ToolRow";
import { useStackBuilder } from "@/lib/hooks/useStackBuilder";
import { formatCurrency } from "@/lib/utils/formatters";

export const StackBuilderForm = memo(function StackBuilderForm() {
  const {
    teamSize,
    primaryUseCase,
    tools,
    loading,
    totalCurrentSpend,
    handleAddTool,
    handleToolChange,
    handleRemoveTool,
    handleTeamSizeChange,
    handleUseCaseChange,
    handleReset,
    handleSubmit,
  } = useStackBuilder();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#0e121c]/80 border border-white/10 shadow-xl backdrop-blur-md">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-mono uppercase tracking-wider text-zinc-400">
              Team Size (Seats)
            </label>
            <span className="text-emerald-400 font-mono font-bold text-lg px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              {teamSize} {teamSize === 1 ? "Seat" : "Seats"}
            </span>
          </div>
          <Slider
            value={[teamSize]}
            onValueChange={handleTeamSizeChange}
            min={1}
            max={500}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-600">
            <span>1</span>
            <span>100</span>
            <span>250</span>
            <span>500+</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-mono uppercase tracking-wider text-zinc-400 block">
            Primary AI Use Case
          </label>
          <Select value={primaryUseCase} onValueChange={handleUseCaseChange}>
            <SelectTrigger className="w-full bg-[#161d2d] border-white/10 text-white focus:ring-emerald-500 focus:border-emerald-500 h-12 text-base">
              <SelectValue placeholder="Select primary objective">
                {USE_CASES.find((uc) => uc.id === primaryUseCase)?.label ||
                  primaryUseCase ||
                  "Select primary objective"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#161d2d] border-white/10 text-white">
              {USE_CASES.map((uc) => (
                <SelectItem key={uc.id} value={uc.id}>
                  {uc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-zinc-500 italic">
            This calibrates our overkill algorithms against industry norms.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-heading font-semibold text-white">
              Active Tools ({tools.length})
            </h3>
          </div>
          <Button
            type="button"
            onClick={handleAddTool}
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 gap-2 h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add AI Tool</span>
          </Button>
        </div>

        {tools.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#0e121c]/40 border border-dashed border-white/10">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3 animate-pulse" />
            <h4 className="text-zinc-300 font-medium mb-1">
              No tools added to your stack yet
            </h4>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
              Click &apos;Add AI Tool&apos; above or choose an instant preset
              stack to start optimizing your burn rate.
            </p>
            <Button
              type="button"
              onClick={handleAddTool}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Tool</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-mono uppercase tracking-wider text-zinc-500">
              <div className="col-span-4">Tool Name</div>
              <div className="col-span-3">Current Tier</div>
              <div className="col-span-2">Active Seats</div>
              <div className="col-span-2">Monthly Spend</div>
              <div className="col-span-1"></div>
            </div>

            {tools.map((tool, index) => (
              <ToolRow
                key={`${tool.toolName}-${index}`}
                tool={tool}
                index={index}
                onToolChange={handleToolChange}
                onRemove={handleRemoveTool}
              />
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-4 z-40 p-6 rounded-2xl bg-[#0e121c] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Total Current Spend
            </span>
            <div className="text-2xl md:text-3xl font-heading font-bold text-white font-mono tracking-tight flex items-baseline gap-2">
              {formatCurrency(totalCurrentSpend)}
              <span className="text-xs font-sans text-zinc-500 font-normal">
                / month
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden md:block" />

          <div className="hidden md:block">
            <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Annual Run-Rate
            </span>
            <div className="text-xl font-heading font-bold text-zinc-300 font-mono tracking-tight">
              {formatCurrency(totalCurrentSpend * 12)}
              <span className="text-xs font-sans text-zinc-500 font-normal">
                / yr
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="text-zinc-400 hover:text-white hover:bg-white/5 h-12 px-4 gap-2 flex-1 md:flex-initial"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>

          <Button
            type="submit"
            disabled={loading || tools.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-heading font-bold text-base h-12 px-8 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all gap-2 flex-2 md:flex-initial"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Running Audit...</span>
              </div>
            ) : (
              <>
                <span>Analyze Stack</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});
