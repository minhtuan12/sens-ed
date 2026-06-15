export type ColorSchemeId = "yellowOnBlack" | "whiteOnBlack" | "blackOnYellow";

export interface LearnerSettings {
  colorScheme: ColorSchemeId;
  fontScale: number;
  speechRate: number;
}

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  role: "learner" | "teacher";
  passwordHash: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  description: string;
  tactilePrompt: string;
  interactionPrompt: string;
  keyboardAction: string;
  position: "left" | "center" | "right";
  imageKind: "tray" | "tong" | "breadbox" | "bread" | "cashier";
  transcription?: string;
}

export type LessonStepKind =
  | "intro"
  | "bakery-map"
  | "vocabulary"
  | "spelling-test"
  | "sentence-pattern"
  | "dilemma"
  | "complete";

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  title: string;
  narration: string;
  prompt: string;
  targetKey?: string;
  vocabularyId?: string;
  visual?: "bakery-storefront" | "bakery-map" | "word-card" | "mic" | "sentence-card" | "cashier" | "waveform" | "situation" | "choice-cards";
  activeVocabularyId?: string;
  highlightedZone?: "left" | "center" | "right";
  mapMarker?: "entrance" | "tray" | "tong" | "breadbox" | "bread" | "cashier";
  sentenceText?: string;
  answer?: string;
  options?: Array<{
    id: string;
    key: "ArrowLeft" | "ArrowRight";
    label: string;
    correct: boolean;
    feedback: string;
  }>;
}

export interface LessonStage {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  unitTitle: string;
  summary: string;
  vocabulary: VocabularyItem[];
  stages: LessonStage[];
}

export interface ProgressRecord {
  userId: string;
  lessonId: string;
  completedStepIds: string[];
  attempts: number;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  displayName: string;
}
