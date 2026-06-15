import type { LearnerSettings } from "@/types/sensed";

export const defaultSettings: LearnerSettings = {
  colorScheme: "yellowOnBlack",
  fontScale: 1,
  speechRate: 0.9
};

export const colorSchemes = {
  yellowOnBlack: {
    id: "yellowOnBlack",
    label: "Yellow on black",
    background: "#000000",
    foreground: "#ffd400",
    brand: "#ffffff",
    focus: "#b58cff"
  },
  whiteOnBlack: {
    id: "whiteOnBlack",
    label: "White on black",
    background: "#000000",
    foreground: "#ffffff",
    brand: "#ffffff",
    focus: "#ffd400"
  },
  blackOnYellow: {
    id: "blackOnYellow",
    label: "Black on yellow",
    background: "#ffd400",
    foreground: "#000000",
    brand: "#000000",
    focus: "#5a2dff"
  }
} as const;

export function clampFontScale(value: number) {
  return Number(Math.min(1.8, Math.max(0.8, value)).toFixed(2));
}

export function clampSpeechRate(value: number) {
  return Math.min(3, Math.max(0.5, Number(value.toFixed(1))));
}
