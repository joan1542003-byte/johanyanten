"use client";

import { useSyncExternalStore } from "react";

const TZ = "America/Santiago";

// One shared ticking second for every clock on the page
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const nowSecond = () => Math.floor(Date.now() / 1000);
const serverSecond = () => 0;

const parts = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const offset = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" });

/** An app-style widget: an analog clock and the local time where Johan works */
export function ClockCard({ city, label }: { city: string; label: string }) {
  const epoch = useSyncExternalStore(subscribe, nowSecond, serverSecond);
  const ready = epoch > 0;

  let h = 10;
  let m = 9;
  let s = 30;
  let gmt = "";
  if (ready) {
    const date = new Date(epoch * 1000);
    const p = Object.fromEntries(parts.formatToParts(date).map((x) => [x.type, x.value]));
    h = Number(p.hour);
    m = Number(p.minute);
    s = Number(p.second);
    gmt = offset.formatToParts(date).find((x) => x.type === "timeZoneName")?.value ?? "";
  }
  // Counted from the start of the day, so the hand keeps turning forward instead of spinning back each minute
  const secondDeg = ready ? (epoch % 86400) * 6 : s * 6;

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-5 sm:p-6">
      <svg viewBox="0 0 100 100" className="h-[clamp(84px,9vw,120px)] w-[clamp(84px,9vw,120px)]" aria-hidden>
        <defs>
          <radialGradient id="face" cx="50%" cy="35%" r="70%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ecebe8" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#face)" stroke="rgba(29,29,31,0.08)" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1={i % 3 === 0 ? 8 : 9.5}
            x2="50"
            y2={i % 3 === 0 ? 15 : 13}
            stroke={i % 3 === 0 ? "#1d1d1f" : "#a1a1a6"}
            strokeWidth={i % 3 === 0 ? 2.4 : 1.6}
            strokeLinecap="round"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <line x1="50" y1="50" x2="50" y2="27" stroke="#1d1d1f" strokeWidth="4" strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * 0.5} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="16" stroke="#1d1d1f" strokeWidth="2.8" strokeLinecap="round" transform={`rotate(${m * 6 + s * 0.1} 50 50)`} />
        <g style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: "50px 50px", transition: ready ? "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)" : undefined }}>
          <line x1="50" y1="58" x2="50" y2="12" stroke="#ff9500" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="2.6" fill="#ff9500" />
      </svg>
      <div>
        <p className="t-label text-ink-2">{label}</p>
        <p className="mt-0.5 font-mono text-[clamp(22px,2vw,28px)] font-medium tracking-tight tabular-nums">
          {ready ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` : "--:--"}
        </p>
        <p className="t-small text-ink-2">
          {city}
          {gmt && <span className="text-ink-3"> · {gmt}</span>}
        </p>
      </div>
    </div>
  );
}
