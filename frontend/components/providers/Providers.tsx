"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/components/LenisProvider";
import { Toaster } from "sonner";
import { LocalStorageSync } from "./LocalStorageSync";
import type { ProvidersProps } from "@/types/providers.types";

export function Providers({ children }: ProvidersProps) {
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
