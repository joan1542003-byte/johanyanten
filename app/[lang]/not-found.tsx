import Link from "next/link";

// The locale isn't available here, so the page speaks both languages
export default function NotFound() {
  return (
    <main className="board board-white py-28 text-center">
      <p className="text-[13px] font-semibold text-soft">404</p>
      <h1 className="mx-auto mt-4 max-w-md text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-semibold tracking-[-0.03em]">
        Esta página no existe. <span className="tone">This page doesn’t exist.</span>
      </h1>
      <div className="mt-9 flex justify-center gap-3">
        <Link href="/es" className="pill-ink inline-flex h-12 items-center rounded-full px-6 font-semibold">
          Ir al inicio
        </Link>
        <Link href="/en" className="pill-ink inline-flex h-12 items-center rounded-full px-6 font-semibold">
          Go home
        </Link>
      </div>
    </main>
  );
}
