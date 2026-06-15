import { describe, expect, it } from "vitest";

import { clampSpeechRate } from "@/lib/settings";

describe("settings", () => {
  it("clamps speech rate to the supported range", () => {
    expect(clampSpeechRate(0.1)).toBe(0.5);
    expect(clampSpeechRate(1.7)).toBe(1.7);
    expect(clampSpeechRate(4)).toBe(3);
  });
});
