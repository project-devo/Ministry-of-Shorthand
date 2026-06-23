import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministry of Shorthand API",
  description: "API server for Ministry of Shorthand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}