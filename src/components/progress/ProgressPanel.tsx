"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useAudioGuide } from "@/hooks/useAudioGuide";

interface StoredProgress {
  lessonId: string;
  stepId: string;
  completedAt: string;
}

export function ProgressPanel() {
  const { speak } = useAudioGuide();
  const [progress, setProgress] = useState<StoredProgress[]>([]);

  useEffect(() => {
    const rawValue = window.localStorage.getItem("sensed-progress-v1");
    const storedProgress = rawValue ? (JSON.parse(rawValue) as StoredProgress[]) : [];
    setProgress(storedProgress);
    speak(`My progress. You have completed ${storedProgress.length} lesson steps on this device.`);
  }, [speak]);

  return (
    <Stack spacing={3} alignItems="center">
      <Typography component="h1" variant="h2" color="primary.main">
        My progress
      </Typography>
      <Box sx={{ width: "min(720px, 100%)", border: 3, borderColor: "primary.main", p: 4 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CheckCircle2 aria-hidden="true" size={48} strokeWidth={3} />
            <Typography component="p" variant="h3">
              {progress.length} steps completed
            </Typography>
          </Stack>
          {progress.length === 0 ? (
            <Typography component="p">No progress saved yet. Open Lesson 1 and complete a guided step.</Typography>
          ) : (
            progress.slice(-6).map((item) => (
              <Typography component="p" key={`${item.lessonId}-${item.stepId}-${item.completedAt}`}>
                {item.lessonId}: {item.stepId}
              </Typography>
            ))
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
