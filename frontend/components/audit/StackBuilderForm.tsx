"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  addTool,
  removeTool,
  resetAuditState,
  setAuditResult,
  setLoading,
  setPrimaryUseCase,
  setTeamSize,
  updateTool,
} from "@/store/auditSlice";
import { SUPPORTED_TOOLS, USE_CASES } from "@/constants/pricing.constants";
import { formatCurrency } from "@/lib/utils/formatters";
import { auditApi } from "@/lib/api/audit.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "@/components/motion";
import { toast } from "sonner";
import { Plus, Trash2, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";

const ToolRow = memo(function ToolRow({
  tool,
  index,
  onToolChange,
  onRemove,
}: {
  tool: any;
  index: number;
  onToolChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}) {
  const toolConfig = SUPPORTED_TOOLS.find((t) => t.toolName === tool.toolName);
  const availableTiers = toolConfig
    ? Object.keys(toolConfig.tiers)
    : ["Free", "Pro", "Team", "Enterprise"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl glass-card glow-hover transition-all"
    >
      {/* Tool Selector */}
      <div className="md:col-span-3 space-y-1">
        <label className="text-[11px] font-medium text-zinc-500 block tracking-wide">
          AI Tool Name
        </label>
        <select
          value={tool.toolName}
          onChange={(e) => onToolChange(index, "toolName", e.target.value)}
          className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        >
          {SUPPORTED_TOOLS.map((t) => (
            <option key={t.toolName} value={t.toolName}>
              {t.toolName}
            </option>
          ))}
        </select>
      </div>

      {/* Tier Selector */}
      <div className="md:col-span-3 space-y-1">
        <label className="text-[11px] font-medium text-zinc-500 block tracking-wide">
          Current Tier / Plan
        </label>
        <select
          value={tool.plan}
          onChange={(e) => onToolChange(index, "plan", e.target.value)}
          className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        >
          {availableTiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div className="md:col-span-2 space-y-1">
        <label className="text-[11px] font-medium text-zinc-500 block tracking-wide">
          Seats / Users
        </label>
        <input
          type="number"
          min={1}
          value={tool.seats}
          onChange={(e) => onToolChange(index, "seats", Number(e.target.value))}
          className="w-full bg-zinc-900/80 border border-white/8 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      {/* Monthly Spend */}
      <div className="md:col-span-3 space-y-1">
        <label className="text-[11px] font-medium text-zinc-500 block tracking-wide">
          Monthly Spend ($ USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-sm font-mono text-zinc-500">
            $
          </span>
          <input
            type="number"
            min={0}
            step="any"
            value={tool.currentMonthlySpend}
            onChange={(e) =>
              onToolChange(index, "currentMonthlySpend", Number(e.target.value))
            }
            className="w-full bg-zinc-900/80 border border-white/8 rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-emerald-400 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Remove Button */}
      <div className="md:col-span-1 flex justify-end pt-5 md:pt-0">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
});

export function StackBuilderForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { teamSize, primaryUseCase, tools, loading } = useAppSelector(
    (state) => state.audit,
  );

  const totalCurrentSpend = tools.reduce(
    (sum, t) => sum + (Number(t.currentMonthlySpend) || 0),
    0,
  );

  const handleAddTool = () => {
    const defaultTool = SUPPORTED_TOOLS[0];
    const defaultTier = Object.keys(defaultTool.tiers)[0];
    const tierConfig = defaultTool.tiers[defaultTier];
    dispatch(
      addTool({
        toolName: defaultTool.toolName,
        plan: defaultTier,
        seats: teamSize,
        currentMonthlySpend: tierConfig.monthlyPricePerSeat * teamSize,
      }),
    );
  };

  const handleToolChange = (index: number, field: string, value: any) => {
    const currentTool = tools[index];
    const updatedTool = { ...currentTool, [field]: value };

    if (field === "toolName") {
      const foundConfig = SUPPORTED_TOOLS.find((t) => t.toolName === value);
      if (foundConfig) {
        const firstTier = Object.keys(foundConfig.tiers)[0];
        const tierConfig = foundConfig.tiers[firstTier];
        updatedTool.plan = firstTier;
        updatedTool.currentMonthlySpend =
          tierConfig.monthlyPricePerSeat * updatedTool.seats;
      }
    } else if (field === "plan") {
      const foundConfig = SUPPORTED_TOOLS.find(
        (t) => t.toolName === currentTool.toolName,
      );
      if (foundConfig && foundConfig.tiers[value]) {
        const tierConfig = foundConfig.tiers[value];
        updatedTool.currentMonthlySpend =
          tierConfig.monthlyPricePerSeat * updatedTool.seats;
      }
    } else if (field === "seats") {
      const numSeats = Number(value) || 0;
      const foundConfig = SUPPORTED_TOOLS.find(
        (t) => t.toolName === currentTool.toolName,
      );
      if (foundConfig && foundConfig.tiers[currentTool.plan]) {
        const tierConfig = foundConfig.tiers[currentTool.plan];
        if (tierConfig.billingType === "per_seat") {
          updatedTool.currentMonthlySpend =
            tierConfig.monthlyPricePerSeat * numSeats;
        }
      }
    }

    dispatch(updateTool({ index, tool: updatedTool }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tools.length === 0) {
      toast.error("Please add at least one tool to evaluate.", {
        description:
          "Use the 'Add AI Tool' button or select an instant preset above.",
      });
      return;
    }

    dispatch(setLoading(true));
    let navigateInitiated = false;

    try {
      const payload = {
        teamSize,
        primaryUseCase,
        tools: tools.map((t) => ({
          toolName: t.toolName,
          plan: t.plan,
          seats: Number(t.seats) || 1,
          currentMonthlySpend: Number(t.currentMonthlySpend) || 0,
        })),
      };

      const result = await auditApi.analyzeStack(payload);
      dispatch(setAuditResult(result));
      toast.success("Audit complete — redirecting to dashboard.", {
        description: `Analyzed ${tools.length} tools for ${teamSize} seats.`,
      });
      navigateInitiated = true;
      router.push(`/dashboard/${result.shareSlug}`);
    } catch (err: any) {
      toast.error("Failed to analyze stack", {
        description:
          err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      if (!navigateInitiated) {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* Main Stack Builder Form */}
      <SlideUp delay={0.1}>
        <Card className="glass-card border-white/6 shadow-2xl">
          <CardHeader className="border-b border-white/6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Configure AI Stack & Parameters
                </CardTitle>
                <p className="text-sm text-zinc-500 mt-1">
                  Enter your organization&apos;s active AI tools, tiers, and
                  monthly licensing spend below.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch(resetAuditState());
                    toast("Form reset to defaults.");
                  }}
                  className="border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset Form
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Core Organization Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-zinc-950/30 border border-white/5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-zinc-300">
                    Total Team Size (Seats)
                  </label>
                  <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-mono text-sm">
                    {teamSize} {teamSize === 1 ? "User" : "Users"}
                  </Badge>
                </div>
                <Slider
                  value={[teamSize]}
                  min={1}
                  max={200}
                  step={1}
                  onValueChange={(val: any) =>
                    dispatch(
                      setTeamSize(
                        Array.isArray(val)
                          ? val[0]
                          : typeof val === "number"
                            ? val
                            : 10,
                      ),
                    )
                  }
                  className="py-2"
                />
                <p className="text-xs text-zinc-600">
                  Adjust seat volume to evaluate bulk enterprise tiers vs retail
                  license efficiency.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-zinc-300 block">
                  Primary Organization Workflow
                </label>
                <select
                  value={primaryUseCase}
                  onChange={(e) => dispatch(setPrimaryUseCase(e.target.value))}
                  className="w-full bg-zinc-900/80 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
                >
                  {USE_CASES.map((uc) => (
                    <option key={uc.id} value={uc.id}>
                      {uc.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-600">
                  Argus uses your workflow to determine domain-specific tool
                  alternatives and feature parity requirements.
                </p>
              </div>
            </div>

            {/* Dynamic Tools List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-300">
                  Active AI Subscriptions & Tool Stack
                </h3>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="button"
                    onClick={handleAddTool}
                    size="sm"
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-white/8"
                  >
                    <Plus className="w-4 h-4 mr-1.5 text-emerald-400" /> Add AI
                    Tool
                  </Button>
                </motion.div>
              </div>

              {tools.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 rounded-2xl border border-dashed border-white/8 text-center space-y-3"
                >
                  <p className="text-sm text-zinc-500">
                    No active tools configured in stack.
                  </p>
                  <Button
                    type="button"
                    onClick={handleAddTool}
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                  >
                    Add Your First Tool
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {tools.map((tool, index) => (
                      <ToolRow
                        key={`${tool.toolName}-${index}`}
                        tool={tool}
                        index={index}
                        onToolChange={handleToolChange}
                        onRemove={(i) => dispatch(removeTool(i))}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Live Cost Summary Footer & Submit */}
            <div className="pt-6 border-t border-white/6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="p-4 rounded-xl glass-card flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] block">
                    Live Monthly Spend
                  </span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatCurrency(totalCurrentSpend)}
                    <span className="text-xs text-zinc-600 font-normal">
                      /mo
                    </span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/8" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] block">
                    Annualized Run-rate
                  </span>
                  <span className="text-xl font-semibold font-mono text-zinc-400">
                    {formatCurrency(totalCurrentSpend * 12)}
                    <span className="text-xs text-zinc-600 font-normal">
                      /yr
                    </span>
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || tools.length === 0}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-6 px-8 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all duration-400 text-base flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running AI Architectural Audit...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Run AI Spend Audit & Optimize
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
