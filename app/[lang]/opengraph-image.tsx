import { ImageResponse } from "next/og";
import { getDictionary, hasLocale } from "./dictionaries";
import { getProjects } from "@/lib/content";
import { thumbnail } from "@/lib/colors";
import { displayImage } from "@/lib/images";

export const alt = "Johan Yanten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card as a small bento, like the site: the name on a white card, four projects beside it
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "es";
  const [dict, projects] = await Promise.all([getDictionary(locale), getProjects()]);
  const thumbs = (await Promise.all(projects.slice(0, 4).map((p) => thumbnail(displayImage(p).src, 520)))).filter(Boolean) as string[];
  const card = { borderRadius: 34, boxShadow: "0 0 0 1px rgba(29,29,31,0.05), 0 18px 40px -22px rgba(29,29,31,0.35)" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", gap: 22, padding: 40, background: "#f1f0ed" }}>
        <div
          style={{
            ...card,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 52,
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 999,
                background: "#1d1d1f",
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              JY
            </div>
            <div style={{ fontSize: 24, color: "#66666b" }}>johanyanten.vercel.app</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, fontWeight: 700, color: "#1d1d1f", letterSpacing: -4, lineHeight: 0.95 }}>Johan Yanten</div>
            <div style={{ fontSize: 30, color: "#66666b", marginTop: 20, lineHeight: 1.3 }}>{dict.meta.description}</div>
          </div>
        </div>
        <div style={{ width: 470, display: "flex", flexWrap: "wrap", gap: 22 }}>
          {thumbs.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" width={224} height={264} style={{ ...card, width: 224, height: 264, objectFit: "cover" }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
