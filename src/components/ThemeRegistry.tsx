"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";

import { useLearnerSettings } from "@/components/settings/LearnerSettingsProvider";
import { createSensedTheme } from "@/theme/createSensedTheme";

export function ThemeRegistry({ children }: { children: ReactNode }) {
  const { settings } = useLearnerSettings();
  const theme = createSensedTheme(settings);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
