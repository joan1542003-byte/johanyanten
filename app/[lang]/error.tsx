"use client";

// Shown if a page fails to render; the visitor can retry without losing their place
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap grid min-h-[80svh] content-center justify-items-center gap-5 pt-28 pb-16 text-center">
      <p className="t-label text-soft">Error</p>
      <h1 className="t-h2 mx-auto max-w-lg">
        Algo no cargó bien. <span className="text-mute">Something didn’t load.</span>
      </h1>
      <button onClick={reset} className="pill-ink t-label inline-flex h-12 items-center rounded-full px-6">
        Reintentar · Retry
      </button>
    </main>
  );
}
