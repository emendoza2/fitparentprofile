import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIT Parent Profile",
  description: "Take the assessment to see your profile.",
  // generator: 'v0.dev',
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
