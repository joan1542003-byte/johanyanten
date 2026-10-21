import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Background } from "@/components/Background";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panel · Johan Yanten",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Background />
        {children}
      </body>
    </html>
  );
}
