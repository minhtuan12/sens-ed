import { describe, expect, it } from "vitest";

import { canAdvanceWithNext, flattenLessonSteps, getNextStepIndex, getPreviousStepIndex, isExpectedKey } from "@/lib/lessonEngine";
import { lessons } from "@/seed/lessons";

describe("lessonEngine", () => {
  it("flattens lesson stages into player steps", () => {
    const bakeryLesson = lessons.find((lesson) => lesson.id === "unit-7-bakery");

    expect(bakeryLesson).toBeDefined();
    expect(flattenLessonSteps(bakeryLesson!)[0]?.id).toBe("bakery-storefront");
    expect(flattenLessonSteps(bakeryLesson!).map((step) => step.id)).not.toContain("bakery-opening");
    expect(flattenLessonSteps(bakeryLesson!).map((step) => step.id)).toContain("shop-orientation");
    expect(flattenLessonSteps(bakeryLesson!).map((step) => step.id)).toContain("word-tray");
    expect(flattenLessonSteps(bakeryLesson!).map((step) => step.id)).toContain("busy-cashier");
  });

  it("keeps step indexes inside the valid range", () => {
    expect(getPreviousStepIndex(0)).toBe(0);
    expect(getPreviousStepIndex(3)).toBe(2);
    expect(getNextStepIndex(3, 4)).toBe(3);
    expect(getNextStepIndex(1, 4)).toBe(2);
  });

  it("matches expected keyboard controls including space aliases", () => {
    expect(isExpectedKey("ArrowRight", "ArrowRight")).toBe(true);
    expect(isExpectedKey(" ", " ")).toBe(true);
    expect(isExpectedKey("Spacebar", " ")).toBe(true);
    expect(isExpectedKey("Enter", " ")).toBe(false);
  });

  it("only allows Next button advancement for explicit Next steps", () => {
    expect(canAdvanceWithNext({ id: "a", kind: "intro", title: "A", narration: "", prompt: "", targetKey: "Enter" })).toBe(true);
    expect(canAdvanceWithNext({ id: "b", kind: "intro", title: "B", narration: "", prompt: "", targetKey: "Tab" })).toBe(false);
    expect(canAdvanceWithNext({ id: "c", kind: "spelling-test", title: "C", narration: "", prompt: "" })).toBe(false);
  });
});
