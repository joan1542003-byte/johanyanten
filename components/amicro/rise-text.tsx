import { Fragment, type CSSProperties } from "react";

// Each word rises out of its own mask, one after another. Pure CSS (.enter), so it starts with the first paint
export function RiseText({ text, delay = 0, step = 0.07 }: { text: string; delay?: number; step?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => (
    <Fragment key={i}>
      {/* The padding keeps descenders inside the mask */}
      <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span
          className="enter inline-block"
          style={{ "--delay": `${delay + i * step}s`, "--ry": "105%", "--rd": "1.3s" } as CSSProperties}
        >
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
