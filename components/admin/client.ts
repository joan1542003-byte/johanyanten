"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase";
import type { Img } from "@/lib/content";

let client: SupabaseClient | null = null;

// One browser client per tab; it keeps the admin session in localStorage
export function getBrowserClient() {
  client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return client;
}

const MAX_SIDE = 3200;

// Downscale large images and convert to WebP before upload (GIFs stay as-is to keep animation)
async function prepare(file: File) {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  if (file.type === "image/gif") {
    bitmap.close();
    return { blob: file as Blob, w: width, h: height, ext: "gif", type: file.type };
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = new OffscreenCanvas(w, h);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.88 });
  return { blob, w, h, ext: "webp", type: "image/webp" };
}

export async function uploadImage(file: File, folder: string): Promise<Img> {
  const supabase = getBrowserClient();
  const { blob, w, h, ext, type } = await prepare(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: type, cacheControl: "31536000" });
  if (error) throw new Error(`No se pudo subir ${file.name}: ${error.message}`);
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { src: data.publicUrl, w, h };
}
