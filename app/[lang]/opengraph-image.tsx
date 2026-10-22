import { ImageResponse } from "next/og";
import { getDictionary, hasLocale } from "./dictionaries";

export const alt = "Johan Yanten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card in the site's palette: warm paper, the pastel aura and ink type
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "es");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(34% 44% at 30% 62%, #FFD54A, rgba(255,213,74,0) 70%), radial-gradient(30% 40% at 60% 36%, #F6A3CB, rgba(246,163,203,0) 72%), radial-gradient(30% 42% at 18% 30%, #9DD6F4, rgba(157,214,244,0) 72%), radial-gradient(28% 40% at 80% 66%, #C5B2F6, rgba(197,178,246,0) 72%), #F7F4F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#141312",
              color: "#fff",
              fontSize: 26,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            JY
          </div>
          <div style={{ fontSize: 26, color: "#141312", fontWeight: 600 }}>johanyanten.vercel.app</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 600, color: "#141312", letterSpacing: -4, lineHeight: 1 }}>Johan Yanten</div>
          <div style={{ fontSize: 34, color: "rgba(20,19,18,0.6)", marginTop: 18, maxWidth: 920 }}>{dict.meta.description}</div>
        </div>
      </div>
    ),
    size,
  );
}
