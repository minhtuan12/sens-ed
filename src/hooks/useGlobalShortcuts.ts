"use client";

import { useEffect } from "react";

import { useLearnerSettings } from "@/components/settings/LearnerSettingsProvider";

export function useGlobalShortcuts() {
  const { increaseFont, decreaseFont } = useLearnerSettings();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        increaseFont();
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        decreaseFont();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [decreaseFont, increaseFont]);
}
