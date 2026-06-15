"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { clampFontScale, clampSpeechRate, defaultSettings } from "@/lib/settings";
import type { ColorSchemeId, LearnerSettings } from "@/types/sensed";

interface LearnerSettingsContextValue {
  settings: LearnerSettings;
  setColorScheme: (colorScheme: ColorSchemeId) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  setSpeechRate: (speechRate: number) => void;
}

const LearnerSettingsContext = createContext<LearnerSettingsContextValue | null>(null);
const storageKey = "sensed-settings-v1";

export function LearnerSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LearnerSettings>(defaultSettings);

  useEffect(() => {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return;
    }

    try {
      setSettings({ ...defaultSettings, ...JSON.parse(rawValue) });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<LearnerSettingsContextValue>(
    () => ({
      settings,
      setColorScheme: (colorScheme) => setSettings((current) => ({ ...current, colorScheme })),
      increaseFont: () => setSettings((current) => ({ ...current, fontScale: clampFontScale(current.fontScale + 0.1) })),
      decreaseFont: () => setSettings((current) => ({ ...current, fontScale: clampFontScale(current.fontScale - 0.1) })),
      setSpeechRate: (speechRate) => setSettings((current) => ({ ...current, speechRate: clampSpeechRate(speechRate) }))
    }),
    [settings]
  );

  return <LearnerSettingsContext.Provider value={value}>{children}</LearnerSettingsContext.Provider>;
}

export function useLearnerSettings() {
  const context = useContext(LearnerSettingsContext);
  if (!context) {
    throw new Error("useLearnerSettings must be used inside LearnerSettingsProvider.");
  }

  return context;
}
