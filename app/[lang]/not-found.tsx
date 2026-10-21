import Link from "next/link";

// The locale isn't available here, so the page speaks both languages
export default function NotFound() {
  return (
    <main className="px-6 py-28 text-center sm:px-12">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">404</p>
      <h1 className="mx-auto mt-4 max-w-md text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.03em]">
        Esta página no existe. <span className="text-muted">This page doesn’t exist.</span>
      </h1>
      <div className="mt-9 flex justify-center gap-3">
        <Link href="/es" className="k-button rounded-full px-5 py-3 font-medium">
          Ir al inicio
        </Link>
        <Link href="/en" className="k-button rounded-full px-5 py-3 font-medium">
          Go home
        </Link>
      </div>
    </main>
  );
}
