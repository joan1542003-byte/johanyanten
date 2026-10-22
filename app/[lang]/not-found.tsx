import Link from "next/link";
import { AsciiObject } from "@/components/ascii/AsciiObject";

// The locale isn't available here, so the page speaks both languages
export default function NotFound() {
  return (
    <main className="wrap grid min-h-[90svh] content-center justify-items-center gap-6 pt-28 pb-16 text-center">
      <div className="h-[260px] w-full max-w-[460px]">
        <AsciiObject shape="cube" label="Un cubo en 3D dibujado con caracteres" />
      </div>
      <p className="t-label text-soft">404</p>
      <h1 className="t-h2 mx-auto max-w-lg">
        Esta página no existe. <span className="text-mute">This page doesn’t exist.</span>
      </h1>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/es" className="pill-ink t-label inline-flex h-12 items-center rounded-full px-6">
          Ir al inicio
        </Link>
        <Link href="/en" className="pill-white t-label inline-flex h-12 items-center rounded-full px-6">
          Go home
        </Link>
      </div>
    </main>
  );
}
