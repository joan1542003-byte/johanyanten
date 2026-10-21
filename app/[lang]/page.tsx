import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { getProjects, getSiteContent } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { WorkGrid } from "@/components/WorkGrid";
import { SectionHeading } from "@/components/Reveal";
import { PageTransition } from "@/components/PageTransition";
import { About, Contact, Tools } from "@/components/Sections";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, projects, content] = await Promise.all([getDictionary(lang), getProjects(), getSiteContent()]);

  const cards = projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    tagline: p.tagline[lang],
    categories: p.categories,
    isNew: p.is_new,
    cover: p.cover,
  }));

  return (
    <PageTransition>
      <main className="flex-1">
        <Hero {...content.hero[lang]} />
        <section id="work" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:py-32">
          <SectionHeading eyebrow={dict.work.eyebrow} title={dict.work.title} />
          <WorkGrid lang={lang} projects={cards} labels={dict.work} />
        </section>
        <Tools {...dict.tools} />
        <About {...content.about[lang]} />
        <Contact {...content.contact[lang]} />
      </main>
    </PageTransition>
  );
}
