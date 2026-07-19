"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setAuditResult } from "@/store/auditSlice";
import { auditApi } from "@/lib/api/audit.api";
import { ExecutiveSummaryCard } from "@/components/audit/ExecutiveSummaryCard";
import { SavingsKpiCards } from "@/components/audit/SavingsKpiCards";
import { SpendComparisonCharts } from "@/components/audit/SpendComparisonCharts";
import { ToolRecommendationsTable } from "@/components/audit/ToolRecommendationsTable";
import { LeadCaptureModal } from "@/components/audit/LeadCaptureModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

export default function DashboardSlugPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const slug = params.slug as string;

  const { auditResult } = useAppSelector((state) => state.audit);
  const [loading, setLoading] = useState(!auditResult);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIfMissing() {
      if (!auditResult || auditResult.shareSlug !== slug) {
        setLoading(true);
        setError(null);
        try {
          const fetched = await auditApi.getAuditBySlug(slug);
          // Convert from AuditReportDto format to PersistedAuditResultDto
          dispatch(
            setAuditResult({
              id: fetched.id,
              shareSlug: fetched.shareSlug,
              toolBreakdowns: fetched.items.map((it) => ({
                toolName: it.toolName,
                currentPlan: it.currentPlan,
                currentSpend: it.currentSpend,
                recommendedAction: it.recommendedAction,
                recommendedPlanOrTool: it.recommendedPlanOrTool,
                estimatedMonthlyCost: it.estimatedMonthlyCost,
                monthlySavings: it.monthlySavings,
                annualSavings: it.annualSavings,
                reason: it.reason,
              })),
              totalMonthlySavings: fetched.totalMonthlySavings,
              totalAnnualSavings: fetched.totalAnnualSavings,
              overallStatus: fetched.overallStatus,
              summaryParagraph: fetched.summaryParagraph,
            }),
          );
        } catch (err: any) {
          setError(err.message || "Could not load audit report.");
        } finally {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchIfMissing();
    }
  }, [slug, auditResult, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-white">
          Synthesizing Architectural Findings...
        </h2>
        <p className="text-sm text-zinc-400 max-w-md">
          Verifying seat overkill rules, calculating annual run-rate discounts,
          and generating AI executive analysis.
        </p>
      </div>
    );
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Audit Report Not Found
        </h2>
        <p className="text-sm text-zinc-400 max-w-md">
          {error || `No report found with share slug: ${slug}`}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          Return to Stack Builder
        </Button>
      </div>
    );
  }

  const totalCurrentMonthlySpend = auditResult.toolBreakdowns.reduce(
    (sum, t) => sum + (Number(t.currentSpend) || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#090d16] to-black py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-zinc-400 hover:text-white -ml-2 mb-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Stack Builder
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              Executive Audit Analysis Report
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono">
              /share/{auditResult.shareSlug}
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Defensible recommendations prepared for your organization by the
            Argus Engine.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <LeadCaptureModal
            shareSlug={auditResult.shareSlug}
            teamSize={10} // default fallback if needed
          />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Executive AI Summary Card */}
        <ExecutiveSummaryCard summaryParagraph={auditResult.summaryParagraph} />

        {/* Savings KPI Cards */}
        <SavingsKpiCards
          totalMonthlySavings={auditResult.totalMonthlySavings}
          totalAnnualSavings={auditResult.totalAnnualSavings}
          overallStatus={auditResult.overallStatus}
          totalCurrentMonthlySpend={totalCurrentMonthlySpend}
        />

        {/* Spend Comparison Charts */}
        <SpendComparisonCharts toolBreakdowns={auditResult.toolBreakdowns} />

        {/* Itemized Recommendations Table */}
        <ToolRecommendationsTable toolBreakdowns={auditResult.toolBreakdowns} />
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto pt-12 pb-6 border-t border-zinc-800/60 text-center text-xs text-zinc-500">
        <p>Argus Executive Audit Report — Report ID: {auditResult.id}</p>
      </footer>
    </div>
  );
}
