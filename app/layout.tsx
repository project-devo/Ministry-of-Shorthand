import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const jakarta = Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-heading', weight:['600','700','800']});

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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable, jakarta.variable)}>
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