"use client";

// Shown if a page fails to render; the visitor can retry without losing their place
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap grid min-h-[80svh] place-items-center pt-28 pb-16">
      <div className="card w-full max-w-xl p-8 text-center sm:p-12">
        <p className="t-label text-ink-2">Error</p>
        <h1 className="t-card mx-auto mt-3 max-w-sm">
          Algo no cargó bien. <span className="text-ink-3">Something didn’t load.</span>
        </h1>
        <button onClick={reset} className="btn btn-primary mt-8">
          Reintentar · Retry
        </button>
      </div>
    </main>
  );
}
