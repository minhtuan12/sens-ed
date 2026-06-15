"use client";

import type { ReactNode } from "react";

import { LearnerSettingsProvider } from "@/components/settings/LearnerSettingsProvider";
import { ThemeRegistry } from "@/components/ThemeRegistry";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LearnerSettingsProvider>
      <ThemeRegistry>{children}</ThemeRegistry>
    </LearnerSettingsProvider>
  );
}
