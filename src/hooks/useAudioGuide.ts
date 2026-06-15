"use client";

import { useCallback, useEffect, useRef } from "react";

import { useLearnerSettings } from "@/components/settings/LearnerSettingsProvider";

export function useAudioGuide() {
  const { settings } = useLearnerSettings();
  const latestRate = useRef(settings.speechRate);

  useEffect(() => {
    latestRate.current = settings.speechRate;
  }, [settings.speechRate]);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: string = 'vi') => {
      stop();
      if (!window.responsiveVoice) {
        console.warn('responsiveVoice is not loaded yet.');
        return;
      }
      const voice = lang === 'vi' ? 'Vietnamese Female' : 'US English Female';
      // stopAllVoice();
      window.responsiveVoice.speak(text, voice, { rate: latestRate.current, pitch: 1, volume: 1 });
    },
    [stop]
  );

  useEffect(() => stop, [stop]);

  return { speak, stop };
}
