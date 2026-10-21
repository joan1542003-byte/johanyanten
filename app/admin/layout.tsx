import type { Metadata } from "next";
import { satoshi } from "@/components/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Panel · Johan Yanten",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={`${satoshi.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
