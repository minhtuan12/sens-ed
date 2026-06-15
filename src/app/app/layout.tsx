'use client'

import { useEffect, type ReactNode } from "react";

import { LearnerShell } from "@/components/shell/LearnerShell";
import { usePathname, useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "p":
        case "P":
          if (event.altKey) {
            event.preventDefault();
            router.push("/app/progress");
          }
          break;
        case "s":
        case "S":
          if (event.altKey) {
            event.preventDefault();
            router.push("/app/settings");
          }
          break;
        case "l":
        case "L":
          if (event.altKey) {
            event.preventDefault();
            router.push("/app/lessons");
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);
  return <LearnerShell>{children}</LearnerShell>;
}
