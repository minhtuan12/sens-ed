"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Minus, Palette, Plus, Volume2 } from "lucide-react";
import { useEffect } from "react";

import { useLearnerSettings } from "@/components/settings/LearnerSettingsProvider";
import { colorSchemes } from "@/lib/settings";
import { useAudioGuide } from "@/hooks/useAudioGuide";
import type { ColorSchemeId } from "@/types/sensed";

export function SettingsPanel() {
  const { settings, setColorScheme, increaseFont, decreaseFont, setSpeechRate } = useLearnerSettings();
  const { speak } = useAudioGuide();

  useEffect(() => {
    speak("Settings. Choose color scheme, adjust font size with plus or minus, and set voice speed from zero point five to three times.");
  }, [speak]);

  return (
    <Stack spacing={4} alignItems="center">
      <Typography component="h1" variant="h2" color="primary.main">
        Setting
      </Typography>
      <Box sx={{ width: "min(760px, 100%)", border: 3, borderColor: "primary.main", p: { xs: 3, md: 5 } }}>
        <Stack spacing={8}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Palette aria-hidden="true" size={42} strokeWidth={3} />
              <Typography component="h2" variant="h3">
                Color Schemes
              </Typography>
            </Stack>
            <ToggleButtonGroup
              exclusive
              value={settings.colorScheme}
              onChange={(_, value: ColorSchemeId | null) => {
                if (value) {
                  setColorScheme(value);
                  speak(`${colorSchemes[value].label} selected.`);
                }
              }}
              aria-label="Color scheme"
              sx={{
                flexWrap: "wrap",
                gap: 2,
                "& .MuiToggleButtonGroup-grouped": {
                  border: 3,
                  borderRadius: "8px !important",
                  borderColor: "primary.main",
                  color: "primary.main",
                  px: 3,
                  py: 2,
                  fontSize: "1.1rem"
                },
                "& .Mui-selected": {
                  bgcolor: "primary.main !important",
                  color: "primary.contrastText !important"
                }
              }}
            >
              {Object.values(colorSchemes).map((scheme) => (
                <ToggleButton key={scheme.id} value={scheme.id} aria-label={scheme.label}>
                  {scheme.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Stack spacing={2}>
            <Typography component="h2" variant="h3">
              Font size
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button aria-label="Decrease font size" variant="outlined" onClick={decreaseFont} startIcon={<Minus aria-hidden="true" />}>
                Smaller
              </Button>
              <Typography component="p" variant="h3" sx={{ minWidth: 120, textAlign: "center" }}>
                {Math.round(settings.fontScale * 100)}%
              </Typography>
              <Button aria-label="Increase font size" variant="outlined" onClick={increaseFont} startIcon={<Plus aria-hidden="true" />}>
                Larger
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Volume2 aria-hidden="true" size={42} strokeWidth={3} />
              <Typography component="h2" variant="h3">
                Voice settings
              </Typography>
            </Stack>
            <Typography component="p">Speech Rate: {settings.speechRate.toFixed(1)}x</Typography>
            <Slider
              value={settings.speechRate}
              min={0.5}
              max={3}
              step={0.1}
              marks={[
                { value: 0.5, label: "0.5x" },
                { value: 1, label: "1.0x" },
                { value: 2, label: "2.0x" },
                { value: 3, label: "3.0x" }
              ]}
              onChange={(_, value) => setSpeechRate(Array.isArray(value) ? value[0] : value)}
              onChangeCommitted={(_, value) => {
                const nextValue = Array.isArray(value) ? value[0] : value;
                speak(`Speech rate ${nextValue.toFixed(1)} times.`);
              }}
              aria-label="Speech rate"
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": { width: 34, height: 34 },
                "& .MuiSlider-track, & .MuiSlider-rail": { height: 8 },
                "& .MuiSlider-markLabel": { color: "text.primary", fontSize: "1rem" }
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
