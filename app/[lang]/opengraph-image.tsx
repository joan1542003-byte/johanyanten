import { ImageResponse } from "next/og";
import { getDictionary, hasLocale } from "./dictionaries";

export const alt = "Johan Yanten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card in the site's palette: soft gray panel, slate text, one pink highlight
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "es");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#e8e8e8", padding: 48 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#efefef",
            borderRadius: 40,
            padding: 64,
            boxShadow: "0 18px 40px rgba(183,181,203,0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#304f67",
                color: "#fff",
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              JY
            </div>
            <div style={{ fontSize: 24, color: "#94a3b0", letterSpacing: 2, textTransform: "uppercase" }}>
              johanyanten.vercel.app
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, fontWeight: 700, color: "#304f67", letterSpacing: -3, display: "flex" }}>
              Johan{" "}
              <span
                style={{
                  marginLeft: 22,
                  background: "linear-gradient(transparent 58%, rgba(255,143,207,0.45) 58%, rgba(255,143,207,0.45) 92%, transparent 92%)",
                }}
              >
                Yanten
              </span>
            </div>
            <div style={{ fontSize: 34, color: "#94a3b0", marginTop: 16, maxWidth: 900 }}>{dict.meta.description}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
