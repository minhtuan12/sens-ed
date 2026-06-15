"use client";

import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

export function ShortcutListener() {
  useGlobalShortcuts();
  return null;
}
