"use client";

import { useEffect, useState, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setAuditResult,
  setLoading as setReduxLoading,
} from "@/store/auditSlice";
import { auditApi } from "@/lib/api/audit.api";
import { ExecutiveSummaryCard } from "@/components/audit/ExecutiveSummaryCard";
import { SavingsKpiCards } from "@/components/audit/SavingsKpiCards";
import { SpendComparisonCharts } from "@/components/audit/SpendComparisonCharts";
import { ToolRecommendationsTable } from "@/components/audit/ToolRecommendationsTable";
import { LeadCaptureModal } from "@/components/audit/LeadCaptureModal";
import { ArgusLogo } from "@/components/SplashScreen";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";

/* Premium loading skeleton */
const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="relative">
        <div className="w-14 h-14 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <div
          className="absolute inset-0 w-14 h-14 border-2 border-transparent border-b-teal-400/40 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">
          Synthesizing Architectural Findings...
        </h2>
        <p className="text-sm text-zinc-500 max-w-md">
          Verifying seat overkill rules, calculating annual run-rate discounts,
          and generating AI executive analysis.
        </p>
      </div>
    </div>
  );
});

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
          const msg = err.message || "Could not load audit report.";
          setError(msg);
          toast.error("Failed to load audit report", { description: msg });
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
    return <LoadingSkeleton />;
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="p-5 rounded-full glass-card text-red-400">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Audit Report Not Found
        </h2>
        <p className="text-sm text-zinc-500 max-w-md">
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#060a12] to-black py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Bar */}
      <FadeIn className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch(setReduxLoading(false));
              router.push("/");
            }}
            className="text-zinc-500 hover:text-white -ml-2 mb-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Stack Builder
          </Button>
          <div className="flex items-center gap-4">
            <ArgusLogo />
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Executive Audit Report
            </h1>
            <span className="px-2.5 py-0.5 rounded-full glass-card text-zinc-400 text-xs font-mono">
              /share/{auditResult.shareSlug}
            </span>
          </div>
          <p className="text-sm text-zinc-500">
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
      </FadeIn>

      {/* Main Content Sections */}
      <StaggerContainer className="max-w-6xl mx-auto space-y-10">
        {/* Executive AI Summary Card */}
        <StaggerItem>
          <ExecutiveSummaryCard
            summaryParagraph={auditResult.summaryParagraph}
          />
        </StaggerItem>

        {/* Savings KPI Cards */}
        <StaggerItem>
          <SavingsKpiCards
            totalMonthlySavings={auditResult.totalMonthlySavings}
            totalAnnualSavings={auditResult.totalAnnualSavings}
            overallStatus={auditResult.overallStatus}
            totalCurrentMonthlySpend={totalCurrentMonthlySpend}
          />
        </StaggerItem>

        {/* Spend Comparison Charts */}
        <StaggerItem>
          <SpendComparisonCharts toolBreakdowns={auditResult.toolBreakdowns} />
        </StaggerItem>

        {/* Itemized Recommendations Table */}
        <StaggerItem>
          <ToolRecommendationsTable
            toolBreakdowns={auditResult.toolBreakdowns}
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Footer */}
      <FadeIn>
        <footer className="max-w-6xl mx-auto pt-12 pb-6 border-t border-white/5 text-center text-xs text-zinc-600">
          <p>Argus Executive Audit Report — Report ID: {auditResult.id}</p>
        </footer>
      </FadeIn>
    </div>
  );
}
