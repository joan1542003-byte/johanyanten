"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "./client";
import { Button, inputClass, Label, ToastProvider } from "./ui";
import { ProjectsPanel } from "./ProjectsPanel";
import { TextsPanel } from "./TextsPanel";

type Status = "loading" | "signed-out" | "forbidden" | "ready";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const supabase = getBrowserClient();

    async function check(s: Session | null) {
      setSession(s);
      if (!s) return setStatus("signed-out");
      const { data } = await supabase.from("admins").select("user_id").eq("user_id", s.user.id).maybeSingle();
      setStatus(data ? "ready" : "forbidden");
    }

    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      // Token refreshes keep the same user; only re-check on sign in/out
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") check(s);
      else setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = () => getBrowserClient().auth.signOut();

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div key="loading" exit={{ opacity: 0 }} className="flex min-h-svh items-center justify-center">
            <motion.span
              className="h-8 w-8 rounded-full border-2 border-foreground/15 border-t-foreground"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
          </motion.div>
        )}
        {status === "signed-out" && <Login key="login" />}
        {status === "forbidden" && (
          <Centered key="forbidden">
            <h1 className="text-2xl font-semibold tracking-tight">Sin permisos</h1>
            <p className="mt-2 text-muted">
              La cuenta {session?.user.email} existe, pero aún no está autorizada para editar el sitio. Pide que
              la autoricen y vuelve a entrar.
            </p>
            <Button className="mt-6" onClick={signOut}>
              Cerrar sesión
            </Button>
          </Centered>
        )}
        {status === "ready" && session && <Dashboard key="dashboard" session={session} onSignOut={signOut} />}
      </AnimatePresence>
    </ToastProvider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      exit={{ opacity: 0, y: -10 }}
      className="flex min-h-svh items-center justify-center px-4"
    >
      <div className="glass w-full max-w-sm rounded-[2rem] p-8 text-center">{children}</div>
    </motion.div>
  );
}

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const auth = getBrowserClient().auth;
    if (mode === "signin") {
      const { error } = await auth.signInWithPassword({ email, password });
      if (error) setError("Correo o contraseña incorrectos.");
    } else {
      // Signups are closed in the database once the first admin exists
      const { data, error } = await auth.signUp({ email, password });
      if (error) setError(error.message.includes("Password") ? "La contraseña debe tener al menos 6 caracteres." : "El registro está cerrado.");
      else if (!data.session) setCreated(true);
    }
    setBusy(false);
  }

  if (created) {
    return (
      <Centered>
        <h1 className="text-2xl font-semibold tracking-tight">Cuenta creada</h1>
        <p className="mt-2 text-muted">Falta activarla y darle permisos. Cuando esté lista, entra con este correo y contraseña.</p>
        <Button className="mt-6" onClick={() => (setCreated(false), setMode("signin"))}>
          Ir a iniciar sesión
        </Button>
      </Centered>
    );
  }

  return (
    <Centered>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-sm font-semibold text-background">
        JY
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Panel del portafolio</h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "signin" ? "Inicia sesión para editar tu sitio." : "Elige el correo y la contraseña con que entrarás."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4 text-left">
        <label className="block">
          <Label>Correo</Label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <Label>Contraseña</Label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: [8, -6, 4, 0] }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Un momento…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
        }}
        className="mt-5 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        {mode === "signin" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta"}
      </button>
    </Centered>
  );
}

const tabs = [
  { id: "projects", label: "Proyectos" },
  { id: "texts", label: "Textos del sitio" },
] as const;

function Dashboard({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("projects");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-5xl px-4 pt-6 pb-24">
      <header className="glass sticky top-4 z-40 flex items-center gap-2 rounded-full p-1.5 pl-4">
        <span className="mr-auto truncate text-sm font-semibold tracking-tight">Panel · Johan Yanten</span>
        <div className="hidden gap-1 sm:flex">
          <TabButtons tab={tab} setTab={setTab} layoutId="tab-desktop" />
        </div>
        <a href="/" target="_blank" className="rounded-full px-3 py-2 text-sm text-muted hover:text-foreground">
          Ver sitio ↗
        </a>
        <Button variant="ghost" onClick={onSignOut} className="!px-4 !py-2">
          Salir
        </Button>
      </header>
      <div className="mt-4 flex justify-center sm:hidden">
        <div className="glass flex gap-1 rounded-full p-1.5">
          <TabButtons tab={tab} setTab={setTab} layoutId="tab-mobile" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-10"
        >
          {tab === "projects" ? <ProjectsPanel session={session} /> : <TextsPanel session={session} />}
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}

function TabButtons({
  tab,
  setTab,
  layoutId,
}: {
  tab: string;
  setTab: (t: (typeof tabs)[number]["id"]) => void;
  layoutId: string;
}) {
  return tabs.map((t) => (
    <button
      key={t.id}
      onClick={() => setTab(t.id)}
      className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
        tab === t.id ? "text-background" : "text-muted hover:text-foreground"
      }`}
    >
      {tab === t.id && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-foreground"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative">{t.label}</span>
    </button>
  ));
}
