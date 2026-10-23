import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { getProjects, getSiteContent, type Category } from "@/lib/content";
import { tintOf } from "@/lib/colors";
import { displayImage } from "@/lib/images";
import { Hero } from "@/components/Hero";
import { WorkGrid, type CardData } from "@/components/WorkGrid";
import { PageTransition } from "@/components/PageTransition";
import { About, Contact } from "@/components/Sections";
import { INSTAGRAM, SITE_URL } from "@/lib/site";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, projects, content] = await Promise.all([getDictionary(lang), getProjects(), getSiteContent()]);

  const cards: CardData[] = await Promise.all(
    projects.map(async (p) => {
      const image = displayImage(p);
      return {
        slug: p.slug,
        title: p.title[lang],
        tagline: p.tagline[lang],
        categories: p.categories,
        isNew: p.is_new,
        image,
        tint: await tintOf(image.src),
      };
    }),
  );
  const counts = { branding: 0, info: 0, uxui: 0, data: 0, motion: 0 } satisfies Record<Category, number>;
  for (const p of projects) for (const c of p.categories) counts[c]++;

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
      <main>
        <Hero
          lang={lang}
          hero={content.hero[lang]}
          contact={content.contact[lang]}
          labels={{ ...dict.hero, ...dict.overview, view: dict.work.view, copied: dict.contact.copied, filters: dict.work.filters }}
          featured={cards[0]}
          disciplines={{ title: dict.disciplines.title, counts }}
        />
        <section id="work" className="wrap scroll-mt-24 pt-24 sm:pt-36">
          <WorkGrid lang={lang} projects={cards} featured={cards[0].slug} labels={dict.work} />
        </section>
        <About {...content.about[lang]} tools={{ label: dict.tools.eyebrow, title: dict.tools.title, items: dict.tools.items }} />
        <Contact {...content.contact[lang]} copied={dict.contact.copied} />
      </main>
    </PageTransition>
  );
}
