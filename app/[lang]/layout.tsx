import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { FontLinks } from "@/components/fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { Providers } from "@/components/Providers";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.title, template: "%s — Johan Yanten" },
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      type: "website",
      siteName: "Johan Yanten",
      locale: lang === "es" ? "es_CL" : "en_US",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" className="h-full antialiased">
      <head>
        <FontLinks />
      </head>
      <body className="min-h-full">
        <Providers>
          <Nav lang={lang} labels={dict.nav} />
          {/* All content lives on one sheet, as on kree8.studio */}
          <div className="px-3 pt-24 pb-6 sm:px-6 sm:pt-28">
            <div className="k-panel mx-auto max-w-[920px] overflow-hidden rounded-[29px]">
              {children}
              <Footer text={dict.footer} top={dict.top} />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
