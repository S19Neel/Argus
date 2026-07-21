"use client";

import { Providers as BaseProviders } from "@/components/providers/Providers";
import type { ProvidersProps } from "@/types/providers.types";

export function Providers({ children }: ProvidersProps) {
  return <BaseProviders>{children}</BaseProviders>;
}
