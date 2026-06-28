import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Ministry of Shorthand",
  description: "Master Exam-Ready Stenography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background">
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}