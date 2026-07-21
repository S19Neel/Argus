"use client";

import { memo } from "react";
import { useLocalStorageSync } from "@/lib/hooks/useLocalStorageSync";

export const LocalStorageSync = memo(function LocalStorageSync() {
  useLocalStorageSync();
  return null;
});
