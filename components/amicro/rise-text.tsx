import { Fragment, type CSSProperties } from "react";

// Words rise in one after another on load. Pure CSS (.enter), so it starts with the first paint
export function RiseText({ text, delay = 0, step = 0.06 }: { text: string; delay?: number; step?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => (
    <Fragment key={i}>
      <span
        className="enter inline-block"
        style={{ "--delay": `${delay + i * step}s`, "--ry": "0.4em", "--rd": "1.2s" } as CSSProperties}
      >
        {word}
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
