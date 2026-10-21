import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase";

export type Locale = "es" | "en";
export type Localized = Record<Locale, string>;
export type Category = "branding" | "info" | "uxui" | "motion" | "data";
export type Img = { src: string; w: number; h: number };

export type Project = {
  id: string;
  slug: string;
  title: Localized;
  tagline: Localized;
  categories: Category[];
  is_new: boolean;
  published: boolean;
  cover: Img;
  description: Localized[];
  youtube: string | null;
  gallery: Img[];
  position: number;
};

export type HeroContent = { eyebrow: string; title: string; subtitle: string; cta: string; scroll: string };
export type AboutContent = { eyebrow: string; title: string; body: string[] };
export type ContactContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  instagram: string;
  handle: string;
};
export type SiteContent = {
  hero: Record<Locale, HeroContent>;
  about: Record<Locale, AboutContent>;
  contact: Record<Locale, ContactContent>;
};

// Every read is tagged "content"; the admin panel expires the tag after saving
export const CONTENT_TAG = "content";

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("position");
  if (error) throw new Error(`Could not load projects: ${error.message}`);
  return data as Project[];
}

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const { data, error } = await createPublicClient().from("site_content").select("key, value");
  if (error) throw new Error(`Could not load site content: ${error.message}`);
  return Object.fromEntries(data.map((row) => [row.key, row.value])) as SiteContent;
}
