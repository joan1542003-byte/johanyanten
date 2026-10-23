import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

// Headlines: Bricolage Grotesque, a grotesque with character; its width and optical size are tuned per role
export const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

// The emphasized words of a headline, in a serif italic
export const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

// Interface and reading text
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

export const fontVariables = `${display.variable} ${serif.variable} ${geist.variable} ${geistMono.variable}`;
