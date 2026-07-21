"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { hydrateFromStorage } from "@/store/auditSlice";
import { ARGUS_STORAGE_KEY } from "@/constants/audit.constants";
import type { ToolInputDto } from "@/types/audit.types";

interface ParsedStorageState {
  teamSize?: unknown;
  primaryUseCase?: unknown;
  tools?: unknown;
}

export function useLocalStorageSync(): void {
  const dispatch = useAppDispatch();
  const { teamSize, primaryUseCase, tools } = useAppSelector(
    (state) => state.audit,
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARGUS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ParsedStorageState;
        if (
          parsed &&
          typeof parsed.teamSize === "number" &&
          typeof parsed.primaryUseCase === "string" &&
          Array.isArray(parsed.tools)
        ) {
          dispatch(
            hydrateFromStorage({
              teamSize: parsed.teamSize,
              primaryUseCase: parsed.primaryUseCase,
              tools: parsed.tools as ToolInputDto[],
            }),
          );
        }
      }
    } catch {
      // ignore JSON parse or storage errors
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      localStorage.setItem(
        ARGUS_STORAGE_KEY,
        JSON.stringify({ teamSize, primaryUseCase, tools }),
      );
    } catch {
      // ignore storage errors
    }
  }, [teamSize, primaryUseCase, tools]);
}
