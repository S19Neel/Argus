"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "@/store/store";
import { hydrateFromStorage } from "@/store/auditSlice";
import { TooltipProvider } from "@/components/ui/tooltip";

function LocalStorageSync() {
  const dispatch = useAppDispatch();
  const { teamSize, primaryUseCase, tools } = useAppSelector(
    (state) => state.audit,
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("argus_stack_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.teamSize === "number" &&
          Array.isArray(parsed.tools)
        ) {
          dispatch(hydrateFromStorage(parsed));
        }
      }
    } catch {
      // ignore JSON parse or storage errors
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "argus_stack_state",
        JSON.stringify({ teamSize, primaryUseCase, tools }),
      );
    } catch {
      // ignore storage errors
    }
  }, [teamSize, primaryUseCase, tools]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocalStorageSync />
      <TooltipProvider>{children}</TooltipProvider>
    </Provider>
  );
}
