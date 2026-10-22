import { Instrument_Sans } from "next/font/google";

// Instrument Sans, the interface typeface of Relevo, self-hosted by Next
export const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
