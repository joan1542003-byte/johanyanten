import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { fontVariables } from "@/components/fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL("https://johanyanten.vercel.app"),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: { es: "/es", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Nav lang={lang} labels={dict.nav} />
        {children}
        <Footer text={dict.footer} top={dict.top} />
      </body>
    </html>
  );
}
