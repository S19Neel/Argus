"use client";

import { useCallback, useMemo } from "react";
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
import { SUPPORTED_TOOLS } from "@/constants/pricing.constants";
import { auditApi } from "@/lib/api/audit.api";
import { toast } from "sonner";
import type { ToolInputDto, ApiErrorResponse } from "@/types/audit.types";

export function useStackBuilder() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { teamSize, primaryUseCase, tools, loading } = useAppSelector(
    (state) => state.audit,
  );

  const totalCurrentSpend = useMemo(
    () =>
      tools.reduce((sum, t) => sum + (Number(t.currentMonthlySpend) || 0), 0),
    [tools],
  );

  const handleAddTool = useCallback(() => {
    const defaultTool = SUPPORTED_TOOLS[0];
    if (!defaultTool) return;
    const defaultTier = Object.keys(defaultTool.tiers)[0];
    if (!defaultTier) return;
    const tierConfig = defaultTool.tiers[defaultTier];
    if (!tierConfig) return;
    dispatch(
      addTool({
        toolName: defaultTool.toolName,
        plan: defaultTier,
        seats: teamSize,
        currentMonthlySpend: tierConfig.monthlyPricePerSeat * teamSize,
      }),
    );
  }, [dispatch, teamSize]);

  const handleToolChange = useCallback(
    <K extends keyof ToolInputDto>(
      index: number,
      field: K,
      value: ToolInputDto[K],
    ) => {
      const currentTool = tools[index];
      if (!currentTool) return;
      const updatedTool = { ...currentTool, [field]: value };

      if (field === "toolName") {
        const foundConfig = SUPPORTED_TOOLS.find((t) => t.toolName === value);
        if (foundConfig) {
          const firstTier = Object.keys(foundConfig.tiers)[0];
          if (firstTier && foundConfig.tiers[firstTier]) {
            const tierConfig = foundConfig.tiers[firstTier];
            updatedTool.plan = firstTier;
            updatedTool.currentMonthlySpend =
              tierConfig.monthlyPricePerSeat * updatedTool.seats;
          }
        }
      } else if (field === "plan") {
        const foundConfig = SUPPORTED_TOOLS.find(
          (t) => t.toolName === currentTool.toolName,
        );
        if (
          foundConfig &&
          typeof value === "string" &&
          foundConfig.tiers[value]
        ) {
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
          if (tierConfig && tierConfig.billingType === "per_seat") {
            updatedTool.currentMonthlySpend =
              tierConfig.monthlyPricePerSeat * numSeats;
          }
        }
      }

      dispatch(updateTool({ index, tool: updatedTool }));
    },
    [dispatch, tools],
  );

  const handleRemoveTool = useCallback(
    (index: number) => {
      dispatch(removeTool(index));
    },
    [dispatch],
  );

  const handleTeamSizeChange = useCallback(
    (value: number | readonly number[]) => {
      const size = typeof value === "number" ? value : value[0];
      if (size !== undefined) {
        dispatch(setTeamSize(size));
      }
    },
    [dispatch],
  );

  const handleUseCaseChange = useCallback(
    (useCase: string | null) => {
      if (useCase) {
        dispatch(setPrimaryUseCase(useCase));
      }
    },
    [dispatch],
  );

  const handleReset = useCallback(() => {
    dispatch(resetAuditState());
    toast("Form reset to defaults.");
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
      } catch (err: unknown) {
        const errorObj = err as ApiErrorResponse | Error;
        const msg =
          errorObj.message ||
          (errorObj as ApiErrorResponse).error ||
          "An unexpected error occurred. Please try again.";
        toast.error("Failed to analyze stack", {
          description: msg,
        });
      } finally {
        if (!navigateInitiated) {
          dispatch(setLoading(false));
        }
      }
    },
    [dispatch, primaryUseCase, router, teamSize, tools],
  );

  return {
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
  };
}
