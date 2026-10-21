import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { projects } from "@/lib/projects";
import { Hero } from "@/components/Hero";
import { WorkGrid } from "@/components/WorkGrid";
import { SectionHeading } from "@/components/Reveal";
import { PageTransition } from "@/components/PageTransition";
import { About, Contact, Tools } from "@/components/Sections";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const cards = projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    tagline: p.tagline[lang],
    categories: p.categories,
    isNew: p.isNew,
    cover: p.cover,
  }));

  return (
    <PageTransition>
    <main className="flex-1">
      <Hero {...dict.hero} />
      <section id="work" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:py-32">
        <SectionHeading eyebrow={dict.work.eyebrow} title={dict.work.title} />
        <WorkGrid lang={lang} projects={cards} labels={dict.work} />
      </section>
      <Tools {...dict.tools} />
      <About {...dict.about} />
      <Contact {...dict.contact} />
    </main>
    </PageTransition>
  );
}
