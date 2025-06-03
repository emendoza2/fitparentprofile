import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Figtree } from "next/font/google";
import QueryProviders from "./query-providers";
import { AuthProvider } from "@/components/auth/context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "FIT Parent Profile",
  description: "Take the assessment to see your profile.",
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
        <QueryProviders>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProviders>
        <Toaster />
      </body>
    </html>
  );
}
