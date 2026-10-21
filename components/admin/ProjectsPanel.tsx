"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "motion/react";
import type { Session } from "@supabase/supabase-js";
import type { Project } from "@/lib/content";
import { refreshSite } from "@/app/admin/actions";
import { getBrowserClient } from "./client";
import { Button, useToast } from "./ui";
import { ProjectEditor } from "./ProjectEditor";

// Admins also see unpublished drafts (RLS allows it)
const fetchProjects = () => getBrowserClient().from("projects").select("*").order("position");

export function ProjectsPanel({ session }: { session: Session }) {
  const notify = useToast();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);

  const load = useCallback(
    () =>
      fetchProjects().then(({ data, error }) => {
        if (error) notify(`No se pudieron cargar los proyectos: ${error.message}`, "error");
        else setProjects(data as Project[]);
      }),
    [notify],
  );

  useEffect(() => {
    fetchProjects().then(({ data, error }) => {
      if (error) notify(`No se pudieron cargar los proyectos: ${error.message}`, "error");
      else setProjects(data as Project[]);
    });
  }, [notify]);

  async function saveOrder() {
    if (!projects) return;
    const supabase = getBrowserClient();
    const results = await Promise.all(
      projects.map((p, position) =>
        p.position === position ? null : supabase.from("projects").update({ position }).eq("id", p.id),
      ),
    );
    const failed = results.find((r) => r?.error);
    if (failed?.error) return notify(`No se pudo guardar el orden: ${failed.error.message}`, "error");
    setOrderDirty(false);
    await refreshSite(session.access_token);
    notify("Orden guardado");
    load();
  }

  async function onSaved(message: string) {
    setEditing(null);
    await refreshSite(session.access_token);
    notify(message);
    load();
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Proyectos</h1>
          <p className="mt-1 text-sm text-muted">Arrastra desde ⠿ para cambiar el orden en el sitio.</p>
        </div>
        <div className="flex gap-2">
          <AnimatePresence>
            {orderDirty && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Button variant="ghost" onClick={saveOrder}>
                  Guardar orden
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button onClick={() => setEditing("new")}>+ Nuevo proyecto</Button>
        </div>
      </div>

      {projects === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass h-24 animate-pulse rounded-[1.75rem]" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="glass rounded-[1.75rem] p-10 text-center text-muted">Aún no hay proyectos.</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={(next) => {
            setProjects(next);
            setOrderDirty(true);
          }}
          className="space-y-3"
        >
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} onEdit={() => setEditing(p)} />
          ))}
        </Reorder.Group>
      )}

      <AnimatePresence>
        {editing && (
          <ProjectEditor
            key={editing === "new" ? "new" : editing.id}
            project={editing === "new" ? null : editing}
            nextPosition={projects?.length ?? 0}
            onClose={() => setEditing(null)}
            onSaved={onSaved}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectRow({ project, onEdit }: { project: Project; onEdit: () => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      className="glass flex items-center gap-3 rounded-[1.75rem] p-2.5 pr-4"
    >
      <button
        type="button"
        aria-label="Arrastrar para reordenar"
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none px-1.5 text-lg text-muted active:cursor-grabbing"
      >
        ⠿
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail */}
      <img src={project.cover.src} alt="" className="h-16 w-20 shrink-0 rounded-2xl object-cover sm:w-24" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold tracking-tight">{project.title.es}</p>
        <p className="truncate text-sm text-muted">{project.tagline.es}</p>
        <div className="mt-1 flex gap-1.5">
          {!project.published && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              Borrador
            </span>
          )}
          {project.is_new && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">Nuevo</span>
          )}
        </div>
      </div>
      <Button variant="ghost" onClick={onEdit} className="!px-4 !py-2">
        Editar
      </Button>
    </Reorder.Item>
  );
}
