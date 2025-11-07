import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Heist Heistboard",
  description:
    "Task breakdown for Money Heist characters, organized by roles and responsibilities."
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
