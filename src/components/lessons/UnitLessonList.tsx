"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAudioGuide } from "@/hooks/useAudioGuide";

const unitLessons = [
  { key: "1", href: "/app/lessons/unit-7-bakery", label: "LESSON 1" },
  { key: "2", href: "/app/lessons/lesson-2-placeholder", label: "LESSON 2" }
];

export function UnitLessonList() {
  const router = useRouter();
  const { speak } = useAudioGuide();

  useEffect(() => {
    speak("Unit 1. Press one for Lesson 1. Press two for Lesson 2.");

    function handleKeyDown(event: KeyboardEvent) {
      const lesson = unitLessons.find((item) => item.key === event.key);
      if (!lesson) {
        return;
      }

      event.preventDefault();
      router.push(lesson.href);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, speak]);

  return (
    <Stack spacing={4} alignItems="center">
      {unitLessons.map((lesson) => (
        <Button
          key={lesson.key}
          LinkComponent={Link}
          href={lesson.href}
          variant="outlined"
          aria-label={lesson.label}
          sx={{
            width: "min(600px, 100%)",
            minHeight: 100,
            borderRadius: 0,
            justifyContent: "center"
          }}
        >
          <Typography component="span" variant="h2">
            {lesson.label}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
}
