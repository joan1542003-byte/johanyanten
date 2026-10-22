import { notFound } from "next/navigation";

// Any unknown path inside a language falls through to the designed 404 page
export default function CatchAll() {
  notFound();
}
