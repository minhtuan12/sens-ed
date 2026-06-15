import type { Lesson, LessonStep } from "@/types/sensed";

export function flattenLessonSteps(lesson: Lesson): LessonStep[] {
  return lesson.stages.flatMap((stage) => stage.steps);
}

export function getNextStepIndex(currentIndex: number, total: number) {
  return Math.min(total - 1, currentIndex + 1);
}

export function getPreviousStepIndex(currentIndex: number) {
  return Math.max(0, currentIndex - 1);
}

export function isExpectedKey(pressedKey: string, targetKey?: string) {
  if (!targetKey) {
    return false;
  }

  return pressedKey === targetKey || (targetKey === " " && pressedKey === "Spacebar");
}

export function canAdvanceWithNext(step: LessonStep) {
  return !step.options && step.kind !== "spelling-test" && (!step.targetKey || step.targetKey === "Enter");
}
