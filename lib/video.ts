import { cacheLife, cacheTag } from "next/cache";
import sharp from "sharp";
import { CONTENT_TAG } from "./content";

/**
 * The real proportions of a YouTube video (width / height). YouTube draws vertical videos inside a
 * 16:9 frame with black bars, so the bars on its poster tell how wide the picture really is.
 * The player fits the video to its box, so a box with these proportions shows it edge to edge.
 */
export async function videoRatio(id: string): Promise<number> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const wide = 16 / 9;
  try {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    if (!res.ok) return wide;
    // hqdefault is 4:3 with the 16:9 frame letterboxed in the middle; keep only that frame
    const img = sharp(Buffer.from(await res.arrayBuffer()));
    const { width = 480, height = 360 } = await img.metadata();
    const frameH = Math.round(width / wide);
    const { data, info } = await img
      .extract({ left: 0, top: Math.round((height - frameH) / 2), width, height: frameH })
      .resize(160, 90, { fit: "fill" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const lit = (x: number) => {
      let sum = 0;
      for (let y = 0; y < info.height; y++) sum += data[y * info.width + x];
      return sum / info.height > 20;
    };
    let left = 0;
    let right = info.width - 1;
    while (left < right && !lit(left)) left++;
    while (right > left && !lit(right)) right--;
    const ratio = wide * ((right - left + 1) / info.width);
    // Only treat it as narrower when the bars are clear, not a dark scene
    return ratio < 1.2 ? Math.max(0.5, ratio) : wide;
  } catch {
    return wide;
  }
}
