"use client";

import { createContext, use, useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export const inputClass =
  "w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-2.5 text-[15px] outline-none transition placeholder:text-muted/60 focus:border-accent/40 focus:ring-4 focus:ring-accent/15";

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium">
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </span>
  );
}

type Localized = { es: string; en: string };

// Spanish and English side by side, stacked on small screens
export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
  hint,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["es", "en"] as const).map((lang) => (
          <label key={lang} className="relative block">
            <span className="pointer-events-none absolute top-2.5 right-3 text-[11px] font-semibold uppercase text-muted/70">
              {lang}
            </span>
            {multiline ? (
              <textarea
                rows={rows}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                className={`${inputClass} resize-y pr-10`}
              />
            ) : (
              <input
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                className={`${inputClass} pr-10`}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm"
    >
      <span className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-accent" : "bg-black/10"}`}>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${checked ? "right-1" : "left-1"}`}
        />
      </span>
      {label}
    </button>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-foreground text-background",
    ghost: "glass text-foreground",
    danger: "bg-red-500/10 text-red-600 hover:bg-red-500/15",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 6000 : 3000);
  }, []);

  return (
    <ToastContext value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`glass rounded-full px-5 py-2.5 text-sm font-medium ${t.tone === "error" ? "text-red-600" : ""}`}
            >
              {t.tone === "ok" ? "✓ " : "⚠ "}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext>
  );
}

export const useToast = () => use(ToastContext);
