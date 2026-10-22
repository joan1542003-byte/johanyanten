// Small icon set in the Relevo style: 24px grid, 1.8 rounded stroke, no fill
const paths = {
  arrow: <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  back: <path d="M19.5 12h-15M10 6.5L4.5 12l5.5 5.5" />,
  external: <path d="M8 16L16.5 7.5M9.5 7.5h7v7" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
    </>
  ),
  folder: <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </>
  ),
  check: <path d="M5 12.5l4.4 4.4L19 7.5" />,
  sparkle: (
    <>
      <path d="M10.5 4c.6 4 2.1 5.5 6 6.1-3.9.6-5.4 2.1-6 6.1-.6-4-2.1-5.5-6-6.1 3.9-.6 5.4-2.1 6-6.1z" />
      <path d="M18 14.6c.3 1.7.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.6-.3-1.7-.9-2.3-2.5-2.6 1.6-.2 2.2-.8 2.5-2.5z" />
    </>
  ),
  up: <path d="M12 19.5v-15M6.5 10L12 4.5l5.5 5.5" />,
  play: <path d="M8 6.3c0-.9 1-1.4 1.7-.9l8.4 5.7c.6.4.6 1.4 0 1.8l-8.4 5.7c-.7.5-1.7 0-1.7-.9z" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-[18px] w-[18px]" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
