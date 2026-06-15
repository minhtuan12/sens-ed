"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BookOpen, ChartNoAxesColumnIncreasing, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Brand } from "@/components/Brand";
import { ShortcutListener } from "@/components/ShortcutListener";
import { useAudioGuide } from "@/hooks/useAudioGuide";

const navItems = [
  { href: "/app/lessons", label: "Lesson", icon: BookOpen, guide: "Lesson section" },
  { href: "/app/progress", label: "My progress", icon: ChartNoAxesColumnIncreasing, guide: "My progress section" },
  { href: "/app/settings", label: "Setting", icon: Settings, guide: "Settings section" }
];

export function LearnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { speak } = useAudioGuide();

  useEffect(() => {
    const session = window.localStorage.getItem("sensed-session-v1");
    if (!session) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const active = navItems.find((item) => pathname.startsWith(item.href));
    if (active) {
      speak(`${active.guide}. Use Tab to move between controls. Use number keys in lessons.`);
    }
  }, [pathname, speak]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", px: { xs: 2, md: 5 }, py: 4 }}>
      <ShortcutListener />
      <Stack spacing={{ xs: 3, md: 4 }} height='100%'>
        <Brand />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = pathname.startsWith(item.href);
            return (
              <Button
                key={item.href}
                LinkComponent={Link}
                href={item.href}
                variant="outlined"
                color="primary"
                aria-current={selected ? "page" : undefined}
                startIcon={<Icon aria-hidden="true" size={36} strokeWidth={3} />}
                sx={{
                  width: { xs: "100%", md: 300 },
                  bgcolor: selected ? "primary.main" : "transparent",
                  color: selected ? "primary.contrastText" : "primary.main",
                  "&:hover": {
                    bgcolor: selected ? "primary.main" : "transparent"
                  }
                }}
              >
                <Stack spacing={0.5}>
                  <Typography component="span" fontWeight={800} fontSize="1.25em" lineHeight={1} textAlign='center'>
                    {item.label}
                  </Typography>
                </Stack>
              </Button>
            );
          })}
        </Stack>
        <Box display='flex' justifyContent='center'>
          <Divider sx={{ borderColor: "primary.main", borderWidth: 2, width: "min(900px, 80vw)", mx: "auto" }} />
        </Box>
        {children}
      </Stack>
    </Box>
  );
}
