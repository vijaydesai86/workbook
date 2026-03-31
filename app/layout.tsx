import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Workbook",
  description: "A train/work activity workbook powered by GitHub Copilot SDK."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
