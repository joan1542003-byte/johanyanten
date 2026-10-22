"use client";

import { Safe } from "@/components/Safe";
import { useEffect, useRef, useState } from "react";

/*
 * Hand-drawn ASCII illustrations, animated frame by frame.
 * Each scene is a function of a frame counter that returns the lines to print.
 * They tick only while on screen, and hold their first frame for reduced motion.
 */

type Scene = (f: number) => string[];

// Writes `text` into a line at column `x`, keeping the line's width
const put = (line: string, x: number, text: string) => line.slice(0, x) + text + line.slice(x + text.length);
const blank = (w: number, h: number) => Array.from({ length: h }, () => " ".repeat(w));

/** Branding: a pen nib drawing a signature line */
const nib: Scene = (f) => {
  const cycle = f % 22;
  const len = Math.min(14, cycle);
  const curve = "~-~^~-~_~-~^~-".slice(0, len);
  return [
    "      __      ",
    "     /  \\     ",
    "    / /\\ \\    ",
    "   / /  \\ \\   ",
    "   \\ \\()/ /   ",
    "    \\ \\/ /    ",
    "     \\  /     ",
    "      \\/      ",
    curve.padEnd(14, " "),
  ];
};

/** Information: a signpost whose arrows keep pointing the way */
const signpost: Scene = (f) => {
  const r = [">  ", " > ", "  >"][f % 3];
  const l = ["  <", " < ", "<  "][f % 3];
  return [
    " .----------.  ",
    " | INFO  " + r + "|  ",
    " '----.-----'  ",
    "  .---'------. ",
    "  |" + l + "  MAPA | ",
    "  '----.-----' ",
    "       |       ",
    "       |       ",
    "  ~~~~~^~~~~~  ",
  ];
};

/** UX/UI: a browser window where a cursor travels to a button and presses it */
const browser: Scene = (f) => {
  const W = 16;
  const lines = [
    ".--------------.",
    "| o o o        |",
    "|--------------|",
    "|              |",
    "|  [  HOLA  ]  |",
    "|              |",
    "|              |",
    "|              |",
    "'--------------'",
  ];
  const path = [
    [12, 7],
    [11, 6],
    [10, 6],
    [10, 6],
    [10, 5],
    [10, 5],
    [10, 5],
    [10, 5],
    [10, 6],
    [10, 6],
    [11, 7],
    [12, 7],
  ];
  const [x, y] = path[f % path.length];
  const pressed = f % path.length >= 4 && f % path.length <= 6;
  if (pressed) lines[4] = "|  [> HOLA <]  |";
  lines[y] = put(lines[y], x, "\\");
  if (y + 1 < 8) lines[y + 1] = put(lines[y + 1], x, "|");
  return lines.map((l) => l.padEnd(W, " "));
};

/** Data: a bar chart that keeps growing and settling */
const chart: Scene = (f) => {
  const H = 6;
  const bars = [0, 1, 2, 3, 4, 5].map((i) => Math.round(3 + 2.4 * Math.sin(f * 0.35 + i * 1.1)));
  const rows = [];
  for (let level = H; level >= 1; level--) {
    rows.push("|" + bars.map((b) => (b >= level ? " ▓" : "  ")).join("") + " ");
  }
  return [...rows, "+" + "-".repeat(13), "  " + "abcdef".split("").join(" ") + " "];
};

/** Motion: a film strip rolling, with a figure walking frame by frame */
const film: Scene = (f) => {
  const poses = [
    [" o ", "/|\\", "/ \\"],
    [" o ", "/|>", " |\\"],
    [" o ", "<|\\", "/| "],
  ];
  const holes = (shift: number) => "o   ".repeat(6).slice(shift % 4, (shift % 4) + 19);
  const frames = [0, 1, 2].map((k) => poses[(f + k) % poses.length]);
  const row = (n: number) => "|" + frames.map((p) => " " + p[n] + " ").join("|") + "|";
  return [holes(f), ".-----.-----.-----.", row(0), row(1), row(2), "'-----'-----'-----'", holes(f + 2)];
};

/** About: a desk with a steaming cup and a screen that keeps typing */
const WORDS = ["branding", "datos", "interfaces", "motion", "información"];
const desk: Scene = (f) => {
  const W = 46;
  const lines = blank(W, 12);
  const steam = [
    ["  ( ", "   )", "  ( "],
    ["   )", "  ( ", "   )"],
  ][Math.floor(f / 3) % 2];
  steam.forEach((s, i) => (lines[i] = put(lines[i], 4, s)));
  lines[3] = put(lines[3], 2, ".______.");
  lines[4] = put(lines[4], 2, "|      |]");
  lines[5] = put(lines[5], 2, "\\      /");
  lines[6] = put(lines[6], 2, " `----'");

  const word = WORDS[Math.floor(f / 18) % WORDS.length];
  const typed = word.slice(0, Math.min(word.length, f % 18));
  const caret = f % 2 === 0 ? "_" : " ";
  lines[1] = put(lines[1], 16, ".--------------------------.");
  lines[2] = put(lines[2], 16, "| > hola, soy johan        |");
  lines[3] = put(lines[3], 16, "| > diseño " + (typed + caret).padEnd(16, " ") + "|");
  lines[4] = put(lines[4], 16, "|                          |");
  lines[5] = put(lines[5], 16, "'-----------.  .-----------'");
  lines[6] = put(lines[6], 28, "|  |");
  lines[7] = put(lines[7], 0, "_".repeat(26) + "/____\\" + "_".repeat(12));
  lines[8] = put(lines[8], 0, "/" + " ".repeat(43) + "/|");
  lines[9] = put(lines[9], 0, "'" + "-".repeat(43) + "' |");
  lines[10] = put(lines[10], 2, "||" + " ".repeat(37) + "||");
  lines[11] = put(lines[11], 2, "||" + " ".repeat(37) + "||");
  return lines;
};

const scenes = { nib, signpost, browser, chart, film, desk };
export type ArtName = keyof typeof scenes;

function ArtFrames({ name, className = "", interval = 160 }: { name: ArtName; className?: string; interval?: number }) {
  const ref = useRef<HTMLPreElement>(null);
  const [f, setF] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setF((n) => n + 1), interval);
    });
    io.observe(el);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [interval]);

  return (
    <pre ref={ref} aria-hidden className={`font-mono leading-[1.15] whitespace-pre select-none ${className}`}>
      {scenes[name](f).join("\n")}
    </pre>
  );
}

// Wrapped so a failure here can never break the page
export function Art(props: Parameters<typeof ArtFrames>[0]) {
  return (
    <Safe>
      <ArtFrames {...props} />
    </Safe>
  );
}
