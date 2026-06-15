"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAudioGuide } from "@/hooks/useAudioGuide";

export function LessonList() {
  const router = useRouter();
  const { speak } = useAudioGuide();
  const [attempt, setAttempt] = useState(0);
  const pathname = usePathname();

  const lessons = [
    { id: "getting-started", title: "Getting Started" },
    { id: "my-space", title: "My Space" },
    { id: "my-daily-life", title: "My Daily Life" },
    { id: "my-community", title: "My Community" },
  ];

  useEffect(() => {
    speak("Chào mừng bạn đến với ứng dụng học tiếng Anh SensED. Bạn đang ở mục bài học, hãy bấm số để di chuyển đến các mục");

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "0":
          event.preventDefault();
          speak("Getting Started", "en");
          break;
        case "1":
          event.preventDefault();
          speak("My Space", "en");
          break;
        case "2":
          event.preventDefault();
          if (attempt + 1 === 2) {
            router.push("/app/lessons/my-daily-life");
          } else {
            speak("My Daily Life", "en");
            setAttempt((prev) => prev + 1);
          }
          break;
        case "3":
          event.preventDefault();
          speak("My Community", "en");
          break;
        case "ArrowRight":
          if (pathname.includes('lessons')) {
            router.push("/app/progress");
          }
          if (pathname.includes('progress')) {
            router.push("/app/settings");
          }
          break;
        case "ArrowLeft":
          if (pathname.includes('progress')) {
            router.push("/app/lessons");
          }
          if (pathname.includes('settings')) {
            router.push("/app/progress");
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, speak, pathname, attempt]);

  return (
    <Stack spacing={4} alignItems="center" justifyContent={"center"} height={'100%'}>
      {lessons.map((lesson, index) => (
        <Button
          key={lesson.id}
          LinkComponent={Link}
          href={index === 2 ? `/app/lessons/${lesson.id}` : undefined}
          variant="outlined"
          aria-label={`${index}. ${lesson.title}`}
          sx={{
            width: "min(700px, 100%)",
            minHeight: 100,
            borderRadius: 1,
            justifyContent: "center",
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main',
            },
          }}
        >
          <Typography component="span" variant="h2">
            {index}. {lesson.title}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
}
