import { connection } from "next/server";
import { createPublicClient } from "@/lib/supabase";

// Daily Vercel cron: a tiny query so the free Supabase project is never paused for inactivity
export async function GET() {
  await connection();
  const { error } = await createPublicClient().from("site_content").select("key").limit(1);
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}
