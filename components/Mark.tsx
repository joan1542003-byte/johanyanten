// A headline with *emphasized words*: those take the serif italic, one step softer
export function Tone({ text, soft = "text-ink-2" }: { text: string; soft?: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className={`em ${soft}`}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}
