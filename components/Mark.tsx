// Renders *words in asterisks* with a highlighter stroke
export function Mark({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="k-mark">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

// Small uppercase section label with a divider line, as on kree8.studio
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4 text-xs font-medium tracking-[0.08em] text-muted uppercase">
      <span className="h-px w-6 bg-[var(--line)]" />
      {children}
      <span className="h-px flex-1 bg-[var(--line)]" />
    </div>
  );
}
