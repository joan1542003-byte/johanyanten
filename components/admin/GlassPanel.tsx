"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { refreshSite } from "@/app/admin/actions";
import { defaultGlass, type GlassSettings } from "@/lib/glass";
import { LiquidGlass } from "../LiquidGlass";
import { Aura } from "../Aura";
import { getBrowserClient } from "./client";
import { Button, Toggle, useToast } from "./ui";

type NumberKey = Exclude<keyof GlassSettings, "enabled">;

const controls: { key: NumberKey; label: string; hint: string; min: number; max: number; step: number }[] = [
  { key: "strength", label: "Refracción", hint: "Cuánto se doblan los bordes", min: 0, max: 80, step: 1 },
  { key: "rim", label: "Ancho del borde", hint: "Qué parte del vidrio dobla la luz", min: 0.1, max: 0.5, step: 0.01 },
  { key: "aberration", label: "Arcoíris", hint: "Separación de colores en el borde", min: 0, max: 10, step: 0.5 },
  { key: "blur", label: "Desenfoque", hint: "Suaviza lo que hay detrás", min: 0, max: 8, step: 0.5 },
  { key: "saturation", label: "Saturación", hint: "Intensidad del color detrás", min: 1, max: 2.2, step: 0.05 },
  { key: "tint", label: "Blanco", hint: "Velo blanco sobre el vidrio", min: 0, max: 0.9, step: 0.02 },
];

const backdrops = [
  { id: "aura", label: "Aura" },
  { id: "stripes", label: "Rayas" },
] as const;

export function GlassPanel({ session }: { session: Session }) {
  const notify = useToast();
  const [glass, setGlass] = useState<GlassSettings | null>(null);
  const [saved, setSaved] = useState<GlassSettings | null>(null);
  const [backdrop, setBackdrop] = useState<(typeof backdrops)[number]["id"]>("stripes");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBrowserClient()
      .from("site_content")
      .select("value")
      .eq("key", "glass")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return notify(`No se pudo cargar: ${error.message}`, "error");
        const value = { ...defaultGlass, ...(data?.value as Partial<GlassSettings> | undefined) };
        setGlass(value);
        setSaved(value);
      });
  }, [notify]);

  if (!glass) return <div className="glass h-96 animate-pulse rounded-[2rem]" />;

  const dirty = JSON.stringify(glass) !== JSON.stringify(saved);
  const set = <K extends keyof GlassSettings>(key: K, value: GlassSettings[K]) => setGlass({ ...glass, [key]: value });

  async function save() {
    setSaving(true);
    const { error } = await getBrowserClient()
      .from("site_content")
      .upsert({ key: "glass", value: glass }, { onConflict: "key" });
    if (!error) await refreshSite(session.access_token);
    setSaving(false);
    if (error) return notify(`No se pudo guardar: ${error.message}`, "error");
    setSaved(glass);
    notify("Liquid glass guardado");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Liquid glass</h1>
        <p className="mt-1 text-sm text-muted">
          Ajusta el vidrio del menú y míralo en vivo. La refracción se ve en Chrome y Edge; Safari y Firefox muestran un
          vidrio esmerilado.
        </p>
      </div>

      {/* Live preview: a copy of the menu over moving content */}
      <section className="relative h-64 overflow-hidden rounded-[2rem] bg-[#f7f4f0] sm:h-72">
        {backdrop === "aura" ? (
          <Aura mode="hero" />
        ) : (
          <div
            className="absolute inset-y-0 left-[-180px] w-[calc(100%+360px)] animate-[stripes_6s_linear_infinite]"
            style={{
              background:
                "linear-gradient(transparent 46%, #f6a3cb 46% 54%, transparent 54%), repeating-linear-gradient(90deg, #141312 0 7px, #f7f4f0 7px 18px)",
            }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <LiquidGlass settings={glass} className="flex items-center gap-1 p-1.5">
            <span className="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#141312] text-[13px] font-semibold text-white">
              JY
            </span>
            <span className="rounded-full bg-[#141312] px-4 py-2 text-sm font-semibold text-white">Proyectos</span>
            <span className="hidden px-4 py-2 text-sm font-semibold text-[#141312]/70 sm:inline">Sobre mí</span>
            <span className="px-4 py-2 text-sm font-semibold text-[#141312]/70">Contacto</span>
          </LiquidGlass>
        </div>
        <div className="absolute top-3 left-3 flex gap-1 rounded-full bg-white/80 p-1 text-xs font-semibold">
          {backdrops.map((b) => (
            <button
              key={b.id}
              onClick={() => setBackdrop(b.id)}
              className={`rounded-full px-3 py-1.5 ${backdrop === b.id ? "bg-[#141312] text-white" : "text-[#141312]/70"}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      <section className="glass space-y-6 rounded-[2rem] p-5 sm:p-8">
        <Toggle checked={glass.enabled} onChange={(v) => set("enabled", v)} label="Refracción activada" />
        <div className={`grid gap-x-10 gap-y-6 sm:grid-cols-2 ${glass.enabled ? "" : "opacity-60"}`}>
          {controls.map((c) => (
            <label key={c.key} className="block">
              <span className="flex items-baseline justify-between gap-2 text-sm font-medium">
                {c.label}
                <span className="font-mono text-xs text-muted tabular-nums">{glass[c.key]}</span>
              </span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={glass[c.key]}
                onChange={(e) => set(c.key, Number(e.target.value))}
                className="mt-2 w-full accent-[#141312]"
              />
              <span className="text-xs text-muted">{c.hint}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-5">
          <Button variant="ghost" onClick={() => setGlass(defaultGlass)}>
            Restablecer
          </Button>
          <Button variant="ghost" disabled={!dirty} onClick={() => saved && setGlass(saved)}>
            Deshacer cambios
          </Button>
          <Button onClick={save} disabled={!dirty || saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </section>
    </div>
  );
}
