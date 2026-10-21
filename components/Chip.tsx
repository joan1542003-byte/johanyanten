import type { Category } from "@/lib/content";

// Pastel status-style chips: white raised pill, colored glyph and label
export const categoryStyle: Record<Category, { color: string; icon: React.ReactNode }> = {
  branding: {
    color: "#d9468f",
    icon: <path d="M8 2.5l1.4 3.6 3.6 1.4-3.6 1.4L8 12.5 6.6 8.9 3 7.5l3.6-1.4z" fill="currentColor" />,
  },
  info: {
    color: "#3b6cf6",
    icon: (
      <>
        <circle cx="8" cy="8" r="6" fill="currentColor" />
        <path d="M8 7.2v3.6M8 5.2v.1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  uxui: {
    color: "#7a5af5",
    icon: (
      <>
        <circle cx="8" cy="8" r="6" fill="currentColor" />
        <path d="M6 10l4-4M6.6 6H10v3.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  data: {
    color: "#1f9d63",
    icon: (
      <>
        <rect x="2" y="2" width="12" height="12" rx="3.5" fill="currentColor" />
        <path d="M5.2 10.5V8.4M8 10.5V5.5M10.8 10.5V7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  motion: {
    color: "#e8830f",
    icon: (
      <>
        <circle cx="8" cy="8" r="6" fill="currentColor" />
        <path d="M6.8 5.6l3.4 2.4-3.4 2.4z" fill="#fff" />
      </>
    ),
  },
};

export function CategoryChip({
  category,
  label,
  size = "md",
}: {
  category: Category;
  label: string;
  size?: "sm" | "md";
}) {
  const { color, icon } = categoryStyle[category];
  return (
    <span
      className={`raised inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      }`}
      style={{ color }}
    >
      <svg viewBox="0 0 16 16" className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden>
        {icon}
      </svg>
      {label}
    </span>
  );
}
