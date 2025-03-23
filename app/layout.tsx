import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { Figtree } from "next/font/google";

export const metadata: Metadata = {
  title: "FIT Parent Profile",
  description: "Take the assessment to see your profile.",
  // generator: 'v0.dev',
};

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
