import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const locales = ["es", "en"] as const;

// Every page in both languages, each pointing to its translation
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const paths = ["", ...projects.map((p) => `/work/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
      priority: path ? 0.7 : 1,
    })),
  );
}
