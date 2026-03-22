import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Hindsight Career Advisor",
  description: "AI Internship & Career Advisor using Hindsight Memory"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
