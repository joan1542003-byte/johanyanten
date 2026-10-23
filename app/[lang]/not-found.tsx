import Link from "next/link";

// The locale isn't available here, so the page speaks both languages
export default function NotFound() {
  return (
    <main className="wrap grid min-h-[90svh] place-items-center pt-28 pb-16">
      <div className="card enter w-full max-w-xl p-8 text-center sm:p-12">
        <p className="bg-linear-to-br from-[#ff9a62] via-[#e1306c] to-[#6b5bff] bg-clip-text text-[clamp(72px,12vw,120px)] leading-none font-semibold tracking-[-0.06em] text-transparent">
          404
        </p>
        <h1 className="t-card mx-auto mt-4 max-w-sm">
          Esta página no existe. <span className="text-ink-3">This page doesn’t exist.</span>
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/es" className="btn btn-primary">
            Ir al inicio
          </Link>
          <Link href="/en" className="btn btn-soft">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
