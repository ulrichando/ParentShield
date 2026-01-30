import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ParentShield - Protect Your Family's Digital Life",
  description: "Take control of screen time and block distracting games and websites with enterprise-grade parental control software.",
  keywords: ["parental control", "screen time", "game blocker", "website filter", "family safety"],
  authors: [{ name: "ParentShield" }],
  openGraph: {
    title: "ParentShield - Protect Your Family's Digital Life",
    description: "Take control of screen time and block distracting games and websites.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-neutral-950 transition-colors`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
