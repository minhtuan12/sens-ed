"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { Brand } from "@/components/Brand";
import { ShortcutListener } from "@/components/ShortcutListener";
import { useAudioGuide } from "@/hooks/useAudioGuide";

export function LoginScreen() {
  const router = useRouter();
  const { speak } = useAudioGuide();
  const [username, setUsername] = useState("anna");
  const [password, setPassword] = useState("learn123");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const message = "Login failed. Please check the learner name and password.";
      setError(message);
      return;
    }

    const session = await response.json();
    window.localStorage.setItem("sensed-session-v1", JSON.stringify(session));
    router.push("/app/lessons");
  }

  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.default", color: "text.primary", px: { xs: 3, md: 5 }, py: 5 }}>
      <ShortcutListener />
      <Brand />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "min(560px, 100%)",
          mx: "auto",
          mt: { xs: 7, md: 5 }
        }}
      >
        <Stack spacing={5}>
          <Typography component="h1" variant="h1" textAlign="center" color="primary.main">
            Log in
          </Typography>
          <Box>
            <Typography component="h4" variant="h4" color="primary.main" mb={1}>
              Tên
            </Typography>
            <TextField
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              inputProps={{ "aria-label": "Learner name" }}
              sx={{ width: "100%" }}
            />
          </Box>
          <Box>
            <Typography component="h4" variant="h4" color="primary.main" mb={1}>
              Mật khẩu
            </Typography>
            <TextField
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              inputProps={{ "aria-label": "Password" }}
              sx={{ width: "100%" }}
            />
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Button type="submit" variant="outlined" startIcon={<LogIn aria-hidden="true" />}>
            Enter SensED
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
