"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAudioGuide } from "@/hooks/useAudioGuide";

const units = [
  { id: "unit-1", title: "Unit 1: In My Room", parent: "my-space" },
  { id: "unit-2", title: "Unit 2: In My Classroom", parent: "my-space" },
  { id: "unit-3", title: "Unit 3: In the Bathroom", parent: "my-space" },
  { id: "unit-4", title: "Unit 4: In the Kitchen", parent: "my-space" },
  { id: "unit-5", title: "Unit 5: In the Bakery", parent: "my-daily-life" },
  { id: "unit-6", title: "Unit 6: In the Grocery Store", parent: "my-daily-life" },
  { id: "unit-7", title: "Unit 7: In the Restaurant", parent: "my-daily-life" },
  { id: "unit-8", title: "Unit 8: At the Bus Stop", parent: "my-daily-life" },
  { id: "unit-9", title: "Unit 9 : At the Park", parent: "my-community" },
  { id: "unit-10", title: "Unit 10: At the Hospital", parent: "my-community" },
  { id: "unit-11", title: "Unit 11: At the Bank", parent: "my-community" },
  { id: "unit-12", title: "Unit 12: At the Train Station", parent: "my-community" },
]

export function UnitList() {
  const router = useRouter();
  const { speak } = useAudioGuide();
  const pathname = usePathname();
  const parent = pathname.split("/")[pathname.split("/").length - 1];
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    speak("Chào mừng bạn đến với ứng dụng học tiếng Anh SensED. Bạn đang ở mục bài học, hãy bấm số để di chuyển đến các mục");

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "1":
          event.preventDefault();
          speak("Unit 1: In My Room", "en");
          break;
        case "2":
          event.preventDefault();
          speak("Unit 2: In My Classroom", "en");
          router.push("/app/lessons/my-daily-life");
          break;
        case "3":
          event.preventDefault();
          speak("Unit 3: In the Bathroom", "en");
          break;
        case "4":
          event.preventDefault();
          speak("Unit 4: In the Kitchen", "en");
          break;
        case "5":
          event.preventDefault();
          if (attempt + 1 === 2) {
            router.push("/app/lessons/my-daily-life/unit-5");
          } else {
            speak("Unit 5: In the Bakery", "en");
            setAttempt((prev) => prev + 1);
          }
          break;
        case "6":
          event.preventDefault();
          speak("Unit 6: In the Grocery Store", "en");
          break;
        case "7":
          event.preventDefault();
          speak("Unit 7: In the Restaurant", "en");
          break;
        case "8":
          event.preventDefault();
          speak("Unit 8: At the Bus Stop", "en");
          break;
        case "9":
          event.preventDefault();
          speak("Unit 9 : At the Park", "en");
          break;
        case "10":
          event.preventDefault();
          speak("Unit 9 : At the Hospital", "en");
          break;
        case "11":
          event.preventDefault();
          speak("Unit 10: At the Bank", "en");
          break;
        case "12":
          event.preventDefault();
          speak("Unit 9 : At the Train Station", "en");
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, speak, pathname, attempt]);

  return (
    <Stack spacing={4} alignItems="center">
      {units.filter((unit) => unit.parent === parent).map((unit) => (
        <Button
          key={unit.id}
          LinkComponent={Link}
          href={unit.id === "unit-5" ? `/app/lessons/${parent}/${unit.id}` : undefined}
          variant="outlined"
          aria-label={`Unit ${unit.id.split("-")[1]}`}
          sx={{
            width: "min(900px, 100%)",
            minHeight: 120,
            borderRadius: 1,
            justifyContent: "flex-start",
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main',
              '& .unit-icon': {          // ✅ target bằng className
                color: 'primary.contrastText !important', // ✅ đảm bảo màu icon cũng đổi
                stroke: 'primary.contrastText !important',
              },
            },
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" justifyContent='flex-start'>
            <House className="unit-icon" size={60} color="#fcd116" />
            <Box sx={{ height: 80, borderLeft: 3, borderColor: "primary.main" }} />
            <Typography component="span" variant="h2">
              {unit.title}
            </Typography>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}
