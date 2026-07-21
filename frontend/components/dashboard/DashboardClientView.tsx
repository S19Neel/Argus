"use client";

import { memo } from "react";
import { useAuditReport } from "@/lib/hooks/useAuditReport";
import { useAppSelector } from "@/store/store";
import { ExecutiveSummaryCard } from "@/components/audit/ExecutiveSummaryCard";
import { SavingsKpiCards } from "@/components/audit/SavingsKpiCards";
import { SpendComparisonCharts } from "@/components/audit/SpendComparisonCharts";
import { ToolRecommendationsTable } from "@/components/audit/ToolRecommendationsTable";
import { LeadCaptureModal } from "@/components/audit/LeadCaptureModal";
import { ArgusLogo } from "@/components/common/ArgusLogo";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface DashboardClientViewProps {
  slug: string;
}

export const DashboardClientView = memo(function DashboardClientView({
  slug,
}: DashboardClientViewProps) {
  const { teamSize } = useAppSelector((state) => state.audit);
  const {
    auditResult,
    loading,
    error,
    totalCurrentMonthlySpend,
    handleBackToBuilder,
  } = useAuditReport(slug);

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
          onClick={handleBackToBuilder}
          className="bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          Return to Stack Builder
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#060a12] to-black py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <FadeIn className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToBuilder}
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
            teamSize={teamSize || 10}
          />
        </div>
      </FadeIn>

      <StaggerContainer className="max-w-6xl mx-auto space-y-10">
        <StaggerItem>
          <ExecutiveSummaryCard
            summaryParagraph={auditResult.summaryParagraph}
          />
        </StaggerItem>

        <StaggerItem>
          <SavingsKpiCards
            totalMonthlySavings={auditResult.totalMonthlySavings}
            totalAnnualSavings={auditResult.totalAnnualSavings}
            overallStatus={auditResult.overallStatus}
            totalCurrentMonthlySpend={totalCurrentMonthlySpend}
          />
        </StaggerItem>

        <StaggerItem>
          <SpendComparisonCharts toolBreakdowns={auditResult.toolBreakdowns} />
        </StaggerItem>

        <StaggerItem>
          <ToolRecommendationsTable
            toolBreakdowns={auditResult.toolBreakdowns}
          />
        </StaggerItem>
      </StaggerContainer>

      <FadeIn>
        <footer className="max-w-6xl mx-auto pt-12 pb-6 border-t border-white/5 text-center text-xs text-zinc-600">
          <p>Argus Executive Audit Report — Report ID: {auditResult.id}</p>
        </footer>
      </FadeIn>
    </div>
  );
});
