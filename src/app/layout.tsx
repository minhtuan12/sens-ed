import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "SensED",
  description: "Audio-guided English learning for visually impaired learners."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
        <script
          src="https://code.responsivevoice.org/responsivevoice.js?key=UcKLVpjO"></script>
      </body>
    </html>
  );
}
