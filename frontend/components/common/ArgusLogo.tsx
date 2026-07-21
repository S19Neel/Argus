"use client";

import { memo } from "react";
import type { ArgusLogoProps } from "@/types/components.types";

export const ArgusLogo = memo(function ArgusLogo({
  className = "",
  id,
}: ArgusLogoProps) {
  return (
    <span
      id={id}
      className={`font-heading font-bold tracking-[0.1em] text-xl bg-gradient-to-b from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent select-none inline-block ${className}`}
    >
      ARGUS
    </span>
  );
});
