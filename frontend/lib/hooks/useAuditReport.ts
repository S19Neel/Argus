"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setAuditResult,
  setLoading as setReduxLoading,
} from "@/store/auditSlice";
import { auditApi } from "@/lib/api/audit.api";
import { toast } from "sonner";
import type {
  ApiErrorResponse,
  PersistedAuditResultDto,
} from "@/types/audit.types";

export function useAuditReport(slug: string): {
  auditResult: PersistedAuditResultDto | null;
  loading: boolean;
  error: string | null;
  totalCurrentMonthlySpend: number;
  handleBackToBuilder: () => void;
} {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { auditResult } = useAppSelector((state) => state.audit);
  const [loading, setLoading] = useState(
    !auditResult || auditResult.shareSlug !== slug,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIfMissing() {
      if (!auditResult || auditResult.shareSlug !== slug) {
        setLoading(true);
        setError(null);
        try {
          const fetched = await auditApi.getAuditBySlug(slug);
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
        } catch (err: unknown) {
          const errorObj = err as ApiErrorResponse | Error;
          const msg =
            errorObj.message ||
            (errorObj as ApiErrorResponse).error ||
            "Could not load audit report.";
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

  const totalCurrentMonthlySpend = useMemo(() => {
    if (!auditResult) return 0;
    return auditResult.toolBreakdowns.reduce(
      (sum, t) => sum + (Number(t.currentSpend) || 0),
      0,
    );
  }, [auditResult]);

  const handleBackToBuilder = useCallback(() => {
    dispatch(setReduxLoading(false));
    router.push("/");
  }, [dispatch, router]);

  return {
    auditResult,
    loading,
    error,
    totalCurrentMonthlySpend,
    handleBackToBuilder,
  };
}
