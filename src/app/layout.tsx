import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Navbar } from "@/components/Navbar";
import { AgentationProvider } from "@/components/AgentationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blueprint Marketplace",
  description: "The ultimate library of reusable building blocks for Hathor Network.",
  icons: {
    icon: "/favicon-brand.png",
    shortcut: "/favicon-brand.png",
    apple: "/favicon-brand.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
        >
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <Navbar />
            <main className="relative pt-12">
              {children}
            </main>
            <VisualEditsMessenger />
            <AgentationProvider />
          </body>
    </html>
  );
}
