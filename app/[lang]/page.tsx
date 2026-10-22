import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { getProjects, getSiteContent } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { WorkGrid } from "@/components/WorkGrid";
import { PageTransition } from "@/components/PageTransition";
import { About, Contact, Disciplines, Tools } from "@/components/Sections";
import { INSTAGRAM, SITE_URL } from "@/lib/site";
import { Ticker } from "@/components/Ticker";

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

  // Structured data so search engines know who the site is about
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Johan Yanten",
    url: `${SITE_URL}/${lang}`,
    jobTitle: lang === "es" ? "Diseñador integral" : "Multidisciplinary designer",
    sameAs: [INSTAGRAM],
  };

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <main className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:gap-7">
        <Hero {...content.hero[lang]} labels={dict.hero} />
        <Ticker items={dict.ticker} />
        <section id="work" className="board board-white scroll-mt-24">
          <WorkGrid lang={lang} projects={cards} labels={dict.work} />
        </section>
        <Disciplines {...dict.disciplines} names={dict.work.filters} />
        <Tools {...dict.tools} glass={content.glass} />
        <About {...content.about[lang]} />
        <Contact {...content.contact[lang]} copied={dict.contact.copied} ascii={dict.contact.ascii} />
      </main>
    </PageTransition>
  );
}
