// Two-tone text: *the part in asterisks* takes the softer second tone
export function Tone({ text, soft = "text-ink-3" }: { text: string; soft?: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className={soft}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}
