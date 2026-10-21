import { Inter, Instrument_Serif } from "next/font/google";

export const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Editorial italic for single emphasized words
export const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const fontVariables = `${inter.variable} ${serif.variable}`;
