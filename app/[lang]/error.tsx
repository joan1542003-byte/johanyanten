"use client";

// Shown if a page fails to render; the visitor can retry without losing their place
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="board board-white grid justify-items-center gap-5 py-24 text-center">
      <p className="t-label text-soft">Error</p>
      <h1 className="t-h2 mx-auto max-w-lg">
        Algo no cargó bien. <span className="tone">Something didn’t load.</span>
      </h1>
      <button onClick={reset} className="pill-ink t-label inline-flex h-12 items-center rounded-full px-6">
        Reintentar · Retry
      </button>
    </main>
  );
}
