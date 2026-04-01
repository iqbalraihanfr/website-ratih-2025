import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = "Ratih Creative Media";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(10,10,10,1) 0%, rgba(24,24,27,1) 60%, rgba(113,63,18,1) 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: 24,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#facc15",
          }}
        >
          Creative Agency
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.fullName}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Fotografi, videografi, branding, dan desain visual untuk brand,
            UMKM, dan project kreatif dari Madiun.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(255,255,255,0.74)",
          }}
        >
          <div>{siteConfig.location}</div>
          <div>{siteConfig.phoneDisplay}</div>
        </div>
      </div>
    ),
    size,
  );
}
