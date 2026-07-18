'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  addTool,
  applyPreset,
  removeTool,
  resetAuditState,
  setAuditResult,
  setError,
  setLoading,
  setPrimaryUseCase,
  setTeamSize,
  updateTool,
} from '@/store/auditSlice';
import { INSTANT_PRESETS } from '@/constants/presets.constants';
import { SUPPORTED_TOOLS, USE_CASES } from '@/constants/pricing.constants';
import { formatCurrency } from '@/lib/utils/formatters';
import { auditApi } from '@/lib/api/audit.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Building2,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function StackBuilderForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { teamSize, primaryUseCase, tools, loading, error } = useAppSelector(
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

    if (field === 'toolName') {
      const foundConfig = SUPPORTED_TOOLS.find((t) => t.toolName === value);
      if (foundConfig) {
        const firstTier = Object.keys(foundConfig.tiers)[0];
        const tierConfig = foundConfig.tiers[firstTier];
        updatedTool.plan = firstTier;
        updatedTool.currentMonthlySpend =
          tierConfig.monthlyPricePerSeat * updatedTool.seats;
      }
    } else if (field === 'plan') {
      const foundConfig = SUPPORTED_TOOLS.find(
        (t) => t.toolName === currentTool.toolName,
      );
      if (foundConfig && foundConfig.tiers[value]) {
        const tierConfig = foundConfig.tiers[value];
        updatedTool.currentMonthlySpend =
          tierConfig.monthlyPricePerSeat * updatedTool.seats;
      }
    } else if (field === 'seats') {
      const numSeats = Number(value) || 0;
      const foundConfig = SUPPORTED_TOOLS.find(
        (t) => t.toolName === currentTool.toolName,
      );
      if (foundConfig && foundConfig.tiers[currentTool.plan]) {
        const tierConfig = foundConfig.tiers[currentTool.plan];
        if (tierConfig.billingType === 'per_seat') {
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
      dispatch(setError('Please add at least one tool to evaluate.'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

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
      router.push(`/dashboard/${result.shareSlug}`);
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to analyze stack.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'startup-coding':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'design-writing':
        return <TrendingUp className="w-4 h-4 text-teal-400" />;
      case 'enterprise-copilot':
        return <Building2 className="w-4 h-4 text-violet-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* Instant Test Presets Bar */}
      <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-violet-500/10 p-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Instant Evaluation Presets
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Select an instant architectural configuration below to test defensible
            rule triggers and live executive summaries immediately.
          </p>
        </div>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {INSTANT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => dispatch(applyPreset(preset.id))}
              className="group text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-emerald-500/50 hover:bg-zinc-800/60 transition-all duration-300 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-800/80 group-hover:bg-emerald-500/10 transition-colors">
                    {getPresetIcon(preset.id)}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-zinc-700 text-zinc-300 group-hover:border-emerald-500/40 group-hover:text-emerald-300"
                  >
                    {preset.badge}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                  {preset.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {preset.subtitle}
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Apply Configuration <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Main Stack Builder Form */}
      <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-zinc-800/80 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Configure AI Stack & Parameters
              </CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                Enter your organization&apos;s active AI tools, tiers, and monthly
                licensing spend below.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(resetAuditState())}
              className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset Form
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Core Organization Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-800/80">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-200">
                  Total Team Size (Seats)
                </label>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 font-mono text-sm">
                  {teamSize} {teamSize === 1 ? 'User' : 'Users'}
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
                        : typeof val === 'number'
                          ? val
                          : 10,
                    ),
                  )
                }
                className="py-2"
              />
              <p className="text-xs text-zinc-500">
                Adjust seat volume to evaluate bulk enterprise tiers vs retail
                license efficiency.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-200 block">
                Primary Organization Workflow
              </label>
              <select
                value={primaryUseCase}
                onChange={(e) => dispatch(setPrimaryUseCase(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.id} value={uc.id}>
                    {uc.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                Argus uses your workflow to determine domain-specific tool alternatives
                and feature parity requirements.
              </p>
            </div>
          </div>

          {/* Dynamic Tools List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-200">
                Active AI Subscriptions & Tool Stack
              </h3>
              <Button
                type="button"
                onClick={handleAddTool}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
              >
                <Plus className="w-4 h-4 mr-1.5 text-emerald-400" /> Add AI Tool
              </Button>
            </div>

            {tools.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3">
                <p className="text-sm text-zinc-400">
                  No active tools configured in stack.
                </p>
                <Button
                  type="button"
                  onClick={handleAddTool}
                  size="sm"
                  variant="outline"
                  className="border-zinc-700"
                >
                  Add Your First Tool
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tools.map((tool, index) => {
                  const toolConfig = SUPPORTED_TOOLS.find(
                    (t) => t.toolName === tool.toolName,
                  );
                  const availableTiers = toolConfig
                    ? Object.keys(toolConfig.tiers)
                    : ['Free', 'Pro', 'Team', 'Enterprise'];

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                    >
                      {/* Tool Selector */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[11px] font-medium text-zinc-400 block">
                          AI Tool Name
                        </label>
                        <select
                          value={tool.toolName}
                          onChange={(e) =>
                            handleToolChange(index, 'toolName', e.target.value)
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                        <label className="text-[11px] font-medium text-zinc-400 block">
                          Current Tier / Plan
                        </label>
                        <select
                          value={tool.plan}
                          onChange={(e) =>
                            handleToolChange(index, 'plan', e.target.value)
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                        <label className="text-[11px] font-medium text-zinc-400 block">
                          Seats / Users
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={tool.seats}
                          onChange={(e) =>
                            handleToolChange(
                              index,
                              'seats',
                              Number(e.target.value),
                            )
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Monthly Spend */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[11px] font-medium text-zinc-400 block">
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
                              handleToolChange(
                                index,
                                'currentMonthlySpend',
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-emerald-400 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="md:col-span-1 flex justify-end pt-5 md:pt-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => dispatch(removeTool(index))}
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Cost Summary Footer & Submit */}
          <div className="pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-6">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                  Live Monthly Spend
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(totalCurrentSpend)}
                  <span className="text-xs text-zinc-500 font-normal">/mo</span>
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                  Annualized Run-rate
                </span>
                <span className="text-xl font-semibold font-mono text-zinc-300">
                  {formatCurrency(totalCurrentSpend * 12)}
                  <span className="text-xs text-zinc-500 font-normal">/yr</span>
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || tools.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-6 px-8 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 text-base flex items-center gap-2"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
