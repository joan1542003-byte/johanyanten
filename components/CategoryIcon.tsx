import type { Category } from "@/lib/content";

// One drawn mark per discipline, on the 24px grid of the icon set
const marks: Record<Category, React.ReactNode> = {
  // A pen nib: identity and drawing
  branding: (
    <>
      <path d="M12 3.5l5.5 7-5.5 10-5.5-10z" />
      <path d="M12 13.2v7.3" />
      <circle cx="12" cy="11.3" r="1.6" />
    </>
  ),
  // A signpost: information that orients
  info: (
    <>
      <path d="M12 3.5v17" />
      <path d="M12 5.5h6.5l2 2.25-2 2.25H12z" />
      <path d="M12 12h-6.5l-2 2.25 2 2.25H12z" />
    </>
  ),
  // A window and a pointer: interfaces
  uxui: (
    <>
      <rect x="3.5" y="4.5" width="17" height="13" rx="2.5" />
      <path d="M3.5 8.5h17" />
      <path d="M12.5 12.5l6.5 2.4-2.8 1.1-1.1 2.8z" />
    </>
  ),
  // Bars rising: data
  data: (
    <>
      <path d="M5.5 19.5v-5" />
      <path d="M10 19.5V9.5" />
      <path d="M14.5 19.5v-7" />
      <path d="M19 19.5V5" />
    </>
  ),
  // A play mark inside a frame: motion
  motion: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="M10.5 9.6c0-.6.6-.9 1.1-.6l3.7 2.4c.4.3.4.9 0 1.2l-3.7 2.4c-.5.3-1.1 0-1.1-.6z" />
    </>
  ),
};

export function CategoryIcon({ category, className = "h-4 w-4" }: { category: Category; className?: string }) {
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
      {marks[category]}
    </svg>
  );
}
