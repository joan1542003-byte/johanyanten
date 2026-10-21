"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Locale, SiteContent } from "@/lib/content";
import { refreshSite } from "@/app/admin/actions";
import { getBrowserClient } from "./client";
import { Button, inputClass, Label, LocalizedField, useToast } from "./ui";

type Key = keyof SiteContent;

// Field definitions per section; `paragraphs` fields are stored as arrays, edited as blank-line separated text
const sections: {
  key: Key;
  title: string;
  fields: { name: string; label: string; hint?: string; multiline?: boolean; paragraphs?: boolean }[];
  shared?: { name: string; label: string; hint?: string }[];
}[] = [
  {
    key: "hero",
    title: "Portada",
    fields: [
      { name: "eyebrow", label: "Texto pequeño superior" },
      { name: "title", label: "Título", hint: "Usa *asteriscos* para la palabra en cursiva" },
      { name: "subtitle", label: "Bajada", multiline: true },
      { name: "cta", label: "Botón" },
      { name: "scroll", label: "Indicador de scroll" },
    ],
  },
  {
    key: "about",
    title: "Sobre mí",
    fields: [
      { name: "eyebrow", label: "Texto pequeño superior" },
      { name: "title", label: "Título", hint: "Usa *asteriscos* para la palabra en cursiva" },
      { name: "body", label: "Texto", multiline: true, paragraphs: true },
    ],
  },
  {
    key: "contact",
    title: "Contacto",
    fields: [
      { name: "eyebrow", label: "Texto pequeño superior" },
      { name: "title", label: "Título", hint: "Usa *asteriscos* para la palabra en cursiva" },
      { name: "subtitle", label: "Bajada", multiline: true },
      { name: "cta", label: "Botón" },
    ],
    shared: [
      { name: "instagram", label: "Link del botón", hint: "Instagram, correo (mailto:) u otro" },
      { name: "handle", label: "Texto bajo el botón", hint: "Ej: @joandesign.jy" },
    ],
  },
];

type Values = Record<Locale, Record<string, string | string[]>>;

export function TextsPanel({ session }: { session: Session }) {
  const notify = useToast();
  const [content, setContent] = useState<Record<Key, Values> | null>(null);
  const [saving, setSaving] = useState<Key | null>(null);

  useEffect(() => {
    getBrowserClient()
      .from("site_content")
      .select("key, value")
      .then(({ data, error }) => {
        if (error) return notify(`No se pudieron cargar los textos: ${error.message}`, "error");
        setContent(Object.fromEntries(data.map((r) => [r.key, r.value])) as Record<Key, Values>);
      });
  }, [notify]);

  if (!content) return <div className="glass h-96 animate-pulse rounded-[2rem]" />;

  const update = (key: Key, value: Values) => setContent({ ...content, [key]: value });

  async function save(key: Key) {
    setSaving(key);
    const { error } = await getBrowserClient().from("site_content").update({ value: content![key] }).eq("key", key);
    if (!error) await refreshSite(session.access_token);
    setSaving(null);
    if (error) notify(`No se pudo guardar: ${error.message}`, "error");
    else notify("Textos guardados");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Textos del sitio</h1>
        <p className="mt-1 text-sm text-muted">Cada sección se guarda por separado, en español e inglés.</p>
      </div>

      {sections.map((s) => {
        const value = content[s.key];
        const get = (lang: Locale, name: string) => {
          const v = value[lang][name];
          return Array.isArray(v) ? v.join("\n\n") : (v ?? "");
        };
        return (
          <section key={s.key} className="glass space-y-5 rounded-[2rem] p-5 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            {s.fields.map((f) => (
              <LocalizedField
                key={f.name}
                label={f.label}
                hint={f.paragraphs ? "Deja una línea en blanco entre párrafos" : f.hint}
                multiline={f.multiline}
                rows={f.paragraphs ? 7 : 3}
                value={{ es: get("es", f.name), en: get("en", f.name) }}
                onChange={(v) => {
                  const parse = (t: string) => (f.paragraphs ? t.split(/\n\s*\n/) : t);
                  update(s.key, {
                    es: { ...value.es, [f.name]: parse(v.es) },
                    en: { ...value.en, [f.name]: parse(v.en) },
                  });
                }}
              />
            ))}
            {s.shared?.map((f) => (
              <label key={f.name} className="block">
                <Label hint={f.hint}>{f.label}</Label>
                <input
                  value={get("es", f.name)}
                  onChange={(e) =>
                    update(s.key, {
                      es: { ...value.es, [f.name]: e.target.value },
                      en: { ...value.en, [f.name]: e.target.value },
                    })
                  }
                  className={inputClass}
                />
              </label>
            ))}
            <div className="flex justify-end">
              <Button onClick={() => save(s.key)} disabled={saving === s.key}>
                {saving === s.key ? "Guardando…" : `Guardar ${s.title.toLowerCase()}`}
              </Button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
