// Renders *words in asterisks* in the editorial serif italic
export function Emphasis({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="font-display pr-[0.04em]">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}
