"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ArrowLeft, ArrowRight, Check, Divide, DoorOpen, Mic, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import BakeryImage from "@/assets/images/bakery.png";
import Tongs from "@/assets/images/tongs.png";
import { useAudioGuide } from "@/hooks/useAudioGuide";
import { canAdvanceWithNext, flattenLessonSteps, getNextStepIndex, getPreviousStepIndex, isExpectedKey } from "@/lib/lessonEngine";
import { playAudio, speak, stopAudioGroup } from "@/lib/utils";
import type { Lesson, LessonStep, VocabularyItem } from "@/types/sensed";

type MarkerCoordinates = {
  left: number;
  top: number;
};

const openDoorAudio = new URL("../../assets/audios/open-door.mp3", import.meta.url).href;
const puttingObjectAudio = new URL("../../assets/audios/putting-object.mp3", import.meta.url).href;
const markerMoveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const steps = useMemo(() => flattenLessonSteps(lesson), [lesson]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [controlledMarker, setControlledMarker] = useState<MarkerCoordinates | null>(null);
  const [isMapLocationConfirmed, setIsMapLocationConfirmed] = useState(false);
  const { speak } = useAudioGuide();
  const step = steps[stepIndex];
  const vocabularyItem = lesson.vocabulary.find((item) => item.id === step.vocabularyId);

  const advanceWithNext = useCallback(() => {
    saveLocalProgress(lesson.id, steps[stepIndex].id);
    if (stepIndex === steps.length - 1) {
      router.push("/app/progress");
      return;
    }

    setStepIndex((current) => getNextStepIndex(current, steps.length));
  }, [lesson.id, router, stepIndex, steps]);

  useEffect(() => {
    setFeedback("");
    setTypedAnswer("");
    setControlledMarker(step.mapMarker ? markerPosition(step.mapMarker) : null);
    setIsMapLocationConfirmed(false);
    playBakeryStepAudio(lesson.id, step.id);
    speak(`${step.title}. ${step.narration} ${step.prompt}`);
  }, [lesson.id, speak, step]);

  useEffect(() => {
    return () => {
      stopAudioGroup("bakery-background");
      stopAudioGroup("bakery-effects");
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Backspace" && lesson.id === "lesson-2-placeholder") {
        event.preventDefault();
        router.push("/app/lessons/my-daily-life/unit-1");
        return;
      }

      if (controlledMarker && isMarkerMoveKey(event.key)) {
        event.preventDefault();
        const markerMoveKey = event.key;
        setControlledMarker((current) => current ? moveMarker(current, markerMoveKey) : current);
        const direction = markerMoveKey.replace("Arrow", "").toLowerCase();
        speak(`Moved ${direction}.`);
        return;
      }

      if (event.key === "ArrowDown" && !step.options && !isExpectedKey(event.key, step.targetKey)) {
        event.preventDefault();
        setStepIndex((current) => getNextStepIndex(current, steps.length));
        return;
      }

      if (event.key === "ArrowUp" && !isExpectedKey(event.key, step.targetKey)) {
        event.preventDefault();
        setStepIndex((current) => getPreviousStepIndex(current));
        return;
      }

      if (step.id === "bakery-storefront" && event.key === " ") {
        event.preventDefault();
        playAudio(openDoorAudio, {
          id: "bakery-open-door",
          group: "bakery-effects",
          stopGroupBeforePlay: true
        });
        speak("Con hãy lắng nghe chỉ dẫn từ cô nhé: Phía bên trái của con là khay và kẹp gắp, phía giữa là hộp bánh đựng rất nhiều chiếc bánh mì nóng hổi, phía bên phải gần cửa là quầy thu ngân")
        speak('Nếu con đã sẵn sàng, hãy nhấn nút “Next” để mình khám phá từng từ vựng hôm nay nhé!')
        advanceWithNext();
        return;
      }

      if (step.kind === "bakery-map" && step.targetKey === "Tab" && event.key === "Tab") {
        event.preventDefault();
        setIsMapLocationConfirmed(true);
        const message = `${step.title} selected. Press Next to explore this word.`;
        setFeedback(message);
        speak(message);
        return;
      }

      const option = step.options?.find((item) => item.key === event.key);
      if (option) {
        event.preventDefault();
        setFeedback(option.feedback);
        speak(option.correct ? `Correct. ${option.feedback}` : `Try again. ${option.feedback}`);
        if (option.correct) {
          saveLocalProgress(lesson.id, step.id);
          setTimeout(() => setStepIndex((current) => getNextStepIndex(current, steps.length)), 1200);
        }
        return;
      }

      if (isExpectedKey(event.key, step.targetKey)) {
        event.preventDefault();
        if (step.targetKey === "Tab") {
          setFeedback("Mic activated. Success sound.");
          speak("Mic activated. Correct.");
        }
        saveLocalProgress(lesson.id, step.id);
        setStepIndex((current) => getNextStepIndex(current, steps.length));
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [advanceWithNext, controlledMarker, lesson.id, router, speak, step, steps.length]);

  function completeSpellingStep() {
    if (!step.answer) {
      return;
    }

    if (typedAnswer.trim().toLowerCase() !== step.answer.toLowerCase()) {
      const message = "Wrong answer. Listen again and try typing the word one more time.";
      setFeedback(message);
      speak(message);
      return;
    }

    const message = "Correct. Press Next for the next word.";
    setFeedback(message);
    speak(message);
    saveLocalProgress(lesson.id, step.id);
    setStepIndex((current) => getNextStepIndex(current, steps.length));
  }

  return (
    <Stack spacing={3} alignItems="center">
      {step.kind === "vocabulary" ? null : (
        <Typography component="h1" variant="h2" color="primary.main" textAlign="center">
          {lesson.unitTitle}
        </Typography>
      )}

      <Box sx={{ width: "min(900px, 100%)", minHeight: 410, p: 2 }}>
        <Stack spacing={3} alignItems="center">
          {renderStepVisual(step, vocabularyItem, lesson.vocabulary, controlledMarker, isMapLocationConfirmed)}

          {step.kind === "spelling-test" ? (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
              <TextField
                label="Type answer"
                value={typedAnswer}
                onChange={(event) => setTypedAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    completeSpellingStep();
                  }
                }}
                fullWidth
              />
              <Button variant="outlined" onClick={completeSpellingStep} startIcon={<Check aria-hidden="true" />}>
                Check
              </Button>
            </Stack>
          ) : null}

          {step.options ? (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
              {step.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outlined"
                  onClick={() => {
                    setFeedback(option.feedback);
                    speak(option.correct ? `Correct. ${option.feedback}` : `Try again. ${option.feedback}`);
                    if (option.correct) {
                      saveLocalProgress(lesson.id, step.id);
                      setStepIndex((current) => getNextStepIndex(current, steps.length));
                    }
                  }}
                  startIcon={option.key === "ArrowLeft" ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                  sx={{ flex: 1 }}
                >
                  {option.label}
                </Button>
              ))}
            </Stack>
          ) : null}

          {feedback ? <Typography component="p">{feedback}</Typography> : null}

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* <Button variant="outlined" onClick={() => speak(`${step.title}. ${step.narration} ${step.prompt}`)} startIcon={<Volume2 aria-hidden="true" />}>
              Repeat audio
            </Button> */}
            <Button variant="outlined" onClick={() => setStepIndex((current) => getPreviousStepIndex(current))} startIcon={<ArrowLeft aria-hidden="true" />}>
              Previous
            </Button>
            {canAdvanceWithNext(step) || isMapLocationConfirmed ? (
              <Button
                variant="outlined"
                onClick={advanceWithNext}
                startIcon={<ArrowRight aria-hidden="true" />}
              >
                Next
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

function playBakeryStepAudio(lessonId: string, stepId: string) {
  if (lessonId !== "unit-7-bakery") {
    return;
  }

  if (stepId === "bakery-storefront") {
    // playAudio(bakeryAmbienceAudio, {
    //   id: "bakery-ambience",
    //   group: "bakery-background",
    //   loop: true,
    //   volume: 0.5,
    //   playbackRate: 0.75,
    //   restart: false
    // });
  }

  if (stepId === "map-tray") {
    playAudio(puttingObjectAudio, {
      id: "bakery-putting-object-tray",
      group: "bakery-effects",
      volume: 1,
      pan: -1,
      stopGroupBeforePlay: true
    });
  }
}

function renderStepVisual(step: LessonStep, vocabularyItem: VocabularyItem | undefined, vocabulary: VocabularyItem[], controlledMarker: MarkerCoordinates | null, isMapLocationConfirmed: boolean) {
  if (step.visual === "bakery-storefront") {
    return <BakeryStorefront />;
  }

  if (step.visual === "bakery-map" || step.kind === "bakery-map") {
    return <BakeryMap step={step} controlledMarker={controlledMarker} isMapLocationConfirmed={isMapLocationConfirmed} />;
  }

  if (step.visual === "word-card" && vocabularyItem) {
    return <VocabularyVisual item={vocabularyItem} />;
  }

  if (step.visual === "sentence-card") {
    return <SentenceCard text={step.sentenceText ?? step.title} />;
  }

  if (step.visual === "cashier") {
    return <CashierVisual />;
  }

  if (step.visual === "waveform") {
    return <WaveformVisual />;
  }

  if (step.visual === "choice-cards") {
    return <ChoiceCards step={step} vocabulary={vocabulary} />;
  }

  if (step.visual === "mic" || step.kind === "sentence-pattern") {
    return <Mic aria-hidden="true" size={112} strokeWidth={2.5} />;
  }

  if (step.visual === "situation" || step.kind === "dilemma") {
    return (
      <Typography component="p" variant="h1" color="primary.main">
        SITUATION
      </Typography>
    );
  }

  return <DoorOpen aria-hidden="true" size={118} strokeWidth={2.5} />;
}

function BakeryStorefront() {
  // Voice:bakery-storefront
  useEffect(() => {
    speak("Chào mừng con đến với Tiệm Bánh Ngọt Ngào! Hôm nay hãy để mình dẫn bạn khám phá tiệm bánh và mua những chiếc bánh mì nóng hổi nhé")
    speak('Bây giờ, con hãy nhấn nút “Spacebar” để mở cửa tiệm nào')
  }, [speak]);

  return (
    <Stack spacing={2} alignItems="center">
      <Image
        alt="Yellow line illustration of a bakery storefront"
        src={BakeryImage}
        priority
        style={{
          width: "min(410px, 92vw)",
          height: "auto"
        }}
      />
    </Stack>
  );
}

function BakeryMap({ step, controlledMarker, isMapLocationConfirmed }: { step: LessonStep; controlledMarker: MarkerCoordinates | null; isMapLocationConfirmed: boolean }) {
  const activeZone = isMapLocationConfirmed || step.targetKey !== "Tab" ? step.highlightedZone : undefined;

  return (
    <Box sx={{ width: "min(820px, 100%)", aspectRatio: "16 / 8.2", position: "relative", color: "primary.main" }} aria-label="In the bakery map">
      <Box
        sx={{
          position: "absolute",
          left: "3%",
          top: "42%",
          width: "22%",
          height: "13%",
          border: 4,
          borderColor: "primary.main",
          bgcolor: activeZone === "left" ? "primary.main" : "transparent",
          animation: activeZone === "left" ? "sensedPulse 900ms ease-in-out 2" : "none"
        }}
      />
      <Image alt="Tongs" src={Tongs} width={80} height={80} style={{ rotate: '120deg', position: 'absolute', left: '7%', top: '14%' }} />
      {/* <Box sx={{ position: "absolute", left: "10%", top: "25%", width: "7%", height: "5%", borderBottom: 5, borderColor: "primary.main", transform: "rotate(35deg)" }} /> */}
      <Box sx={{ position: "absolute", left: "39%", top: "36%", width: "18%", height: "34%", border: 4, borderColor: "primary.main", animation: activeZone === "center" ? "sensedPulse 900ms ease-in-out 2" : "none" }}>
        <Box sx={{ position: "absolute", left: "26%", right: "26%", top: "38%", height: "18%", border: 3, borderRadius: "50%", borderColor: "primary.main" }} />
      </Box>
      <Box sx={{ position: "absolute", right: "-3%", top: "56%", width: "28%", height: "31%", border: 4, borderColor: "primary.main", animation: activeZone === "right" ? "sensedPulse 900ms ease-in-out 2" : "none" }} />
      {controlledMarker ? (
        <Box
          sx={{
            position: "absolute",
            left: `${controlledMarker.left}%`,
            top: `${controlledMarker.top}%`,
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "primary.main",
            animation: "sensedPulse 900ms ease-in-out 1",
            transition: "left 160ms ease, top 160ms ease"
          }}
        />
      ) : null}
      <Box
        sx={{
          "@keyframes sensedPulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.25 }
          }
        }}
      />
    </Box>
  );
}

function markerPosition(marker: NonNullable<LessonStep["mapMarker"]>): MarkerCoordinates {
  const positions = {
    entrance: { left: 49, top: 86 },
    tray: { left: 26, top: 48 },
    tong: { left: 18, top: 27 },
    breadbox: { left: 49, top: 58 },
    bread: { left: 49, top: 58 },
    cashier: { left: 83, top: 69 }
  };

  return positions[marker];
}

function isMarkerMoveKey(key: string): key is typeof markerMoveKeys[number] {
  return markerMoveKeys.some((moveKey) => moveKey === key);
}

function moveMarker(marker: MarkerCoordinates, key: typeof markerMoveKeys[number]): MarkerCoordinates {
  const stepSize = 10;

  switch (key) {
    case "ArrowUp":
      return { ...marker, top: clampMarkerCoordinate(marker.top - stepSize) };
    case "ArrowDown":
      return { ...marker, top: clampMarkerCoordinate(marker.top + stepSize) };
    case "ArrowLeft":
      return { ...marker, left: clampMarkerCoordinate(marker.left - stepSize) };
    case "ArrowRight":
      return { ...marker, left: clampMarkerCoordinate(marker.left + stepSize) };
  }
}

function clampMarkerCoordinate(value: number) {
  return Math.min(92, Math.max(4, value));
}

function VocabularyVisual({ item }: { item: VocabularyItem }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems="center" justifyContent="center" width="100%">
      <Box sx={{ width: 370, height: 450, display: "grid", placeItems: "center", borderRight: { md: 3 }, borderColor: "primary.main" }}>
        {renderVocabularyDrawing(item)}
      </Box>
      <Stack spacing={6} alignItems={{ xs: "center", md: "flex-start" }} ml={8}>
        <Typography component="p" variant="h1" textAlign='center' width={'100%'} color="primary.main" fontSize={64}>
          {item.word}
        </Typography>
        <Typography component="p" textAlign='center' width={'100%'} variant="h1" color="primary.main" fontSize={24}>
          ({item.transcription})
        </Typography>
        <Typography component="p" variant="h2" textAlign='center' width={'100%'} color="primary.main" fontSize={32}>
          {item.translation}
        </Typography>
      </Stack>
    </Stack>
  );
}

function renderVocabularyDrawing(item: VocabularyItem) {
  switch (item.imageKind) {
    case "tong":
      return <TongDrawing />;
    case "breadbox":
      return <BreadboxDrawing />;
    case "bread":
      return <BreadDrawing />;
    case "cashier":
      return <CashierCounterDrawing />;
    default:
      return <TrayDrawing />;
  }
}

function TrayDrawing() {
  return (
    <Box sx={{ width: 260, height: 320, border: 5, borderColor: "primary.main", position: "relative" }}>
      <Box sx={{ position: "absolute", inset: 16, border: 4, borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: 50, right: 50, top: -35, height: 35, borderTop: 4, borderLeft: 4, borderRight: 4, borderColor: "primary.main", transform: "skewX(-32deg)" }} />
      <Box sx={{ position: "absolute", left: 50, right: 50, bottom: -3, height: 35, borderTop: 4, borderLeft: 4, borderRight: 4, borderColor: "primary.main", transform: "skewX(-32deg)" }} />
    </Box>
  );
}

function TongDrawing() {
  return (
    <Image src={Tongs} alt="Tong" width={260} height={260} style={{ rotate: '180deg' }} />
  );
}

function BreadboxDrawing() {
  return (
    <Box sx={{ width: 270, height: 150, border: 5, borderColor: "primary.main", borderRadius: "90px / 70px", position: "relative" }}>
      <Box sx={{ position: "absolute", left: 20, right: 20, top: "47%", borderTop: 3, borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: "48%", bottom: 22, width: 16, height: 16, borderRadius: "50%", bgcolor: "primary.main" }} />
    </Box>
  );
}

function BreadDrawing() {
  return (
    <Box sx={{ width: 130, height: 240, border: 8, borderColor: "primary.main", borderRadius: "50%", position: "relative" }}>
      {[25, 50, 75].map((top) => (
        <Box key={top} sx={{ position: "absolute", left: "22%", right: "22%", top: `${top}%`, height: 20, borderRadius: "50%", bgcolor: "primary.main" }} />
      ))}
    </Box>
  );
}

function CashierCounterDrawing() {
  return (
    <Box sx={{ width: 270, height: 220, position: "relative" }}>
      <Box sx={{ position: "absolute", left: 0, bottom: 0, width: 260, height: 105, border: 5, borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: 118, top: 42, width: 80, height: 80, borderTop: 5, borderLeft: 5, borderRight: 5, borderRadius: "80px 80px 0 0", borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: 0, top: 42, width: 92, height: 55, border: 5, borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: 30, top: 99, width: 38, height: 18, borderTop: 5, borderColor: "primary.main" }} />
      <Box sx={{ position: "absolute", left: 153, top: 0, width: 35, height: 35, border: 5, borderRadius: "50%", borderColor: "primary.main" }} />
    </Box>
  );
}

function SentenceCard({ text }: { text: string }) {
  return (
    <Box sx={{ width: "min(760px, 100%)", minHeight: 260, border: 4, borderStyle: "dashed", borderColor: "primary.main", display: "grid", placeItems: "center", p: 4 }}>
      <Typography component="p" variant="h1" color="primary.main" textAlign="center">
        {text}
      </Typography>
    </Box>
  );
}

function CashierVisual() {
  return (
    <Box sx={{ width: "min(430px, 100%)", height: 300, display: "grid", placeItems: "center" }}>
      <CashierCounterDrawing />
    </Box>
  );
}

function WaveformVisual() {
  return (
    <Box sx={{ width: "min(520px, 100%)", height: 220, position: "relative" }}>
      {Array.from({ length: 31 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            left: `${index * 3.2}%`,
            top: "50%",
            width: 4,
            height: `${20 + Math.abs(15 - index) * 5}px`,
            bgcolor: "primary.main",
            borderRadius: 8,
            transform: "translateY(-50%)"
          }}
        />
      ))}
    </Box>
  );
}

function ChoiceCards({ step, vocabulary }: { step: LessonStep; vocabulary: VocabularyItem[] }) {
  if (step.kind === "spelling-test" && step.answer) {
    const answerLength = step.answer.length;
    return (
      <Stack spacing={3} alignItems="center">
        <Typography component="p" variant="h1" color="primary.main">
          {step.title}
        </Typography>
        <Stack direction="row" spacing={2}>
          {Array.from({ length: answerLength }).map((_, index) => (
            <Box key={index} sx={{ width: 96, height: 96, border: 4, borderColor: "primary.main" }} />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (step.options) {
    return (
      <Stack direction="row" spacing={5} width="min(720px, 100%)" justifyContent="center">
        {step.options.map((option) => (
          <Box key={option.id} sx={{ width: 260, height: 260, border: 4, borderStyle: "dashed", borderColor: "text.primary", display: "grid", placeItems: "center" }}>
            <Typography component="p" variant="h1" color="primary.main">
              {option.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  }

  return <Typography component="p">{vocabulary.length} words ready.</Typography>;
}

function saveLocalProgress(lessonId: string, stepId: string) {
  const rawSession = window.localStorage.getItem("sensed-session-v1");
  const session = rawSession ? JSON.parse(rawSession) as { userId?: string } : {};
  const rawProgress = window.localStorage.getItem("sensed-progress-v1");
  const progress = rawProgress ? JSON.parse(rawProgress) as Array<{ lessonId: string; stepId: string; completedAt: string }> : [];

  if (!progress.some((item) => item.lessonId === lessonId && item.stepId === stepId)) {
    progress.push({ lessonId, stepId, completedAt: new Date().toISOString() });
    window.localStorage.setItem("sensed-progress-v1", JSON.stringify(progress));
  }

  if (session.userId) {
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.userId, lessonId, stepId })
    }).catch(() => undefined);
  }
}
