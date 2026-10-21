"use server";

import { updateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";
import { createUserClient } from "@/lib/supabase";

// Called by the admin panel after each save so the public site shows the change right away.
// The write itself already happened in the browser, guarded by Row Level Security.
export async function refreshSite(accessToken: string) {
  const supabase = createUserClient(accessToken);
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);
  if (!user) throw new Error("No autorizado");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("No autorizado");

  updateTag(CONTENT_TAG);
}
