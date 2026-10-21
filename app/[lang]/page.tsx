import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { Hero } from "@/components/Hero";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <Hero {...dict.hero} />
    </main>
  );
}
