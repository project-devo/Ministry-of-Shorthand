import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { Navbar } from "@/components/layout/Navbar";
import { AnalyticsScripts } from "@/components/providers/AnalyticsScripts";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ministryofshorthand.com"),
  title: {
    default: "Ministry of Shorthand",
    template: "%s | Ministry of Shorthand",
  },
  description:
    "A modern shorthand and stenography learning platform for exam aspirants and working professionals.",
  openGraph: {
    title: "Ministry of Shorthand",
    description:
      "A modern shorthand and stenography learning platform for exam aspirants and working professionals.",
    url: "https://ministryofshorthand.com",
    siteName: "Ministry of Shorthand",
    images: ["https://ministryofshorthand.com/og-image.svg"],
    type: "website",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsScripts />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <PageTransitionProvider>
              <main className="flex-1">{children}</main>
            </PageTransitionProvider>
          </div>
          <BackToTopButton />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
