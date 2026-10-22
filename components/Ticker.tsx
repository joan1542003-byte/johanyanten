// A slow band of disciplines in monospace, looping forever; pure CSS, pauses on hover
export function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div
      aria-hidden
      className="group relative overflow-hidden rounded-[999px] py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      style={{ background: "linear-gradient(90deg, #fbe3ee, #e9e1fb, #dff0fb, #fdf0cf)" }}
    >
      <div className="flex w-max animate-[ticker_38s_linear_infinite] gap-0 group-hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={i} className="flex items-center font-mono text-[15px] font-semibold tracking-[0.12em] text-ink/80 uppercase">
                <span className="px-6">{item}</span>
                <span className="text-ink/35">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
