"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "@/store/store";
import { hydrateFromStorage } from "@/store/auditSlice";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/components/LenisProvider";
import { Toaster } from "sonner";

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
      <TooltipProvider>
        <LenisProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(14, 18, 28, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#e4e4e7",
                backdropFilter: "blur(16px)",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              },
            }}
            closeButton
            richColors
          />
        </LenisProvider>
      </TooltipProvider>
    </Provider>
  );
}
