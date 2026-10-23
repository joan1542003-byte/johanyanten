import { Geist, Geist_Mono } from "next/font/google";

// Geist: a clean interface typeface, close to the system fonts of an app; self-hosted by Next
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// For numbers that tick, like the clock
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable}`;
