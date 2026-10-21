"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img, Localized, Project } from "@/lib/content";
import { getBrowserClient, uploadImage } from "./client";
import { Button, inputClass, Label, LocalizedField, Toggle, useToast } from "./ui";

const categories: { id: Category; label: string }[] = [
  { id: "branding", label: "Branding" },
  { id: "info", label: "Información" },
  { id: "uxui", label: "UX/UI" },
  { id: "data", label: "Datos" },
  { id: "motion", label: "Motion" },
];

type Draft = Omit<Project, "id" | "position" | "cover"> & { cover: Img | null };

const empty: Draft = {
  slug: "",
  title: { es: "", en: "" },
  tagline: { es: "", en: "" },
  categories: [],
  is_new: true,
  published: true,
  cover: null,
  description: [{ es: "", en: "" }],
  youtube: null,
  gallery: [],
};

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Accepts a full YouTube link or a bare video id
function youtubeId(input: string) {
  const s = input.trim();
  if (!s) return null;
  const match = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : s;
}

export function ProjectEditor({
  project,
  nextPosition,
  onClose,
  onSaved,
}: {
  project: Project | null;
  nextPosition: number;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const notify = useToast();
  const [draft, setDraft] = useState<Draft>(() => (project ? { ...project } : empty));
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [youtube, setYoutube] = useState(project?.youtube ?? "");
  const [uploading, setUploading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const folder = `projects/${draft.slug || "sin-nombre"}`;

  async function upload(files: FileList | null, onDone: (imgs: Img[]) => void) {
    if (!files?.length) return;
    setUploading((n) => n + files.length);
    try {
      const imgs = await Promise.all([...files].map((f) => uploadImage(f, folder)));
      onDone(imgs);
    } catch (e) {
      notify((e as Error).message, "error");
    } finally {
      setUploading((n) => n - files.length);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft.cover) return notify("Falta la imagen de portada", "error");
    if (!draft.slug) return notify("Falta la URL del proyecto", "error");
    if (!draft.categories.length) return notify("Elige al menos una categoría", "error");

    setSaving(true);
    const row = {
      slug: draft.slug,
      title: draft.title,
      tagline: draft.tagline,
      categories: draft.categories,
      is_new: draft.is_new,
      published: draft.published,
      cover: draft.cover,
      gallery: draft.gallery,
      youtube: youtubeId(youtube),
      description: draft.description.filter((p) => p.es.trim() || p.en.trim()),
    };
    const supabase = getBrowserClient();
    const { error } = project
      ? await supabase.from("projects").update(row).eq("id", project.id)
      : await supabase.from("projects").insert({ ...row, position: nextPosition });
    setSaving(false);

    if (error?.code === "23505") return notify("Ya existe un proyecto con esa URL", "error");
    if (error) return notify(`No se pudo guardar: ${error.message}`, "error");
    onSaved(project ? "Proyecto actualizado" : "Proyecto creado");
  }

  async function remove() {
    if (!project) return;
    setSaving(true);
    const { error } = await getBrowserClient().from("projects").delete().eq("id", project.id);
    setSaving(false);
    if (error) return notify(`No se pudo eliminar: ${error.message}`, "error");
    onSaved("Proyecto eliminado");
  }

  const moveGallery = (i: number, dir: -1 | 1) => {
    const g = [...draft.gallery];
    [g[i], g[i + dir]] = [g[i + dir], g[i]];
    set("gallery", g);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-foreground/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="glass mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl space-y-7 rounded-[2rem] !bg-[#f8f7f4]/90 p-5 sm:my-10 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{project ? "Editar proyecto" : "Nuevo proyecto"}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="glass h-9 w-9 rounded-full text-muted">
            ✕
          </button>
        </div>

        <LocalizedField
          label="Título"
          value={draft.title}
          onChange={(title) => {
            setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title.es) }));
          }}
        />
        <LocalizedField
          label="Subtítulo"
          hint="Ej: Branding · Podcast"
          value={draft.tagline}
          onChange={(v) => set("tagline", v)}
        />

        <label className="block">
          <Label hint="Solo minúsculas, números y guiones">URL</Label>
          <div className="flex items-center gap-1 text-sm text-muted">
            <span className="hidden sm:inline">johanyanten.vercel.app/es/work/</span>
            <input
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={inputClass}
            />
          </div>
        </label>

        <div>
          <Label>Categorías</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = draft.categories.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() =>
                    set("categories", on ? draft.categories.filter((x) => x !== c.id) : [...draft.categories, c.id])
                  }
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    on ? "bg-foreground text-background" : "bg-white/70 text-muted hover:text-foreground"
                  }`}
                >
                  {c.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Toggle checked={draft.published} onChange={(v) => set("published", v)} label="Publicado" />
          <Toggle checked={draft.is_new} onChange={(v) => set("is_new", v)} label="Etiqueta «Nuevo»" />
        </div>

        <div>
          <Label hint="Se usa en la tarjeta y como imagen principal">Portada</Label>
          <ImageDrop
            multiple={false}
            busy={uploading > 0}
            onFiles={(files) => upload(files, ([img]) => set("cover", img))}
          >
            {draft.cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- preview of uploaded image
              <img src={draft.cover.src} alt="" className="max-h-72 w-full rounded-2xl object-cover" />
            ) : null}
          </ImageDrop>
        </div>

        <div>
          <Label hint="Un bloque por párrafo">Descripción</Label>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {draft.description.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <LocalizedField
                    label={`Párrafo ${i + 1}`}
                    multiline
                    value={p}
                    onChange={(v: Localized) =>
                      set(
                        "description",
                        draft.description.map((x, j) => (j === i ? v : x)),
                      )
                    }
                  />
                  {draft.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "description",
                          draft.description.filter((_, j) => j !== i),
                        )
                      }
                      className="absolute top-0 right-0 text-xs text-red-600"
                    >
                      Quitar
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="mt-3"
            onClick={() => set("description", [...draft.description, { es: "", en: "" }])}
          >
            + Párrafo
          </Button>
        </div>

        <label className="block">
          <Label hint="Opcional. Pega el link del video">Video de YouTube</Label>
          <input
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className={inputClass}
          />
        </label>

        <div>
          <Label hint="Puedes elegir varias a la vez">Galería</Label>
          <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AnimatePresence>
              {draft.gallery.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- preview of uploaded image */}
                  <img src={img.src} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <div className="flex gap-1">
                      <MiniButton disabled={i === 0} onClick={() => moveGallery(i, -1)} label="Mover antes">
                        ←
                      </MiniButton>
                      <MiniButton
                        disabled={i === draft.gallery.length - 1}
                        onClick={() => moveGallery(i, 1)}
                        label="Mover después"
                      >
                        →
                      </MiniButton>
                    </div>
                    <MiniButton
                      onClick={() =>
                        set(
                          "gallery",
                          draft.gallery.filter((_, j) => j !== i),
                        )
                      }
                      label="Quitar imagen"
                    >
                      ✕
                    </MiniButton>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <ImageDrop
              multiple
              compact
              busy={uploading > 0}
              onFiles={(files) => upload(files, (imgs) => setDraft((d) => ({ ...d, gallery: [...d.gallery, ...imgs] })))}
            />
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-6">
          {project &&
            (confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                ¿Seguro?
                <Button type="button" variant="danger" onClick={remove} disabled={saving}>
                  Sí, eliminar
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  No
                </Button>
              </span>
            ) : (
              <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
                Eliminar
              </Button>
            ))}
          <div className="ml-auto flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || uploading > 0}>
              {uploading > 0 ? "Subiendo imágenes…" : saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function MiniButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="glass h-7 w-7 rounded-full text-xs disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ImageDrop({
  onFiles,
  multiple,
  compact,
  busy,
  children,
}: {
  onFiles: (files: FileList) => void;
  multiple: boolean;
  compact?: boolean;
  busy: boolean;
  children?: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
      animate={{ scale: over ? 1.02 : 1 }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center text-sm text-muted transition-colors ${
        over ? "border-accent bg-accent/5" : "border-black/10 bg-white/40 hover:border-black/20"
      } ${children ? "p-2" : compact ? "aspect-[4/3] p-3" : "p-10"}`}
    >
      {children}
      <span>
        {busy ? "Subiendo…" : children ? "Cambiar imagen" : multiple ? "+ Agregar imágenes" : "Arrastra una imagen o haz clic"}
      </span>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        multiple={multiple}
        hidden
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </motion.div>
  );
}
