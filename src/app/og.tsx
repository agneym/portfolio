import { createFileRoute } from "@tanstack/react-router";
import ImageResponse from "takumi-js/response";
// Self-hosted faces, inlined into the server bundle so the image never
// depends on a font CDN at request time.
import unboundedUrl from "@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2?inline";
import atkinsonUrl from "@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2?inline";

/** Clack colorway, light plate (hex mirrors of DESIGN.md). */
const clack = {
  plate: "#eae1fe",
  key: "#fcfbff",
  skirt: "#c2b7da",
  ink: "#25193f",
  mod: "#006a68",
  modSkirt: "#004847",
  onMod: "#fcfbff",
  accent: "#c81c71",
  accentSkirt: "#8e024d",
};

const fromDataUrl = (url: string) =>
  Uint8Array.from(atob(url.slice(url.indexOf(",") + 1)), (c) =>
    c.charCodeAt(0),
  );

const fonts = [
  { name: "Unbounded", data: fromDataUrl(unboundedUrl) },
  { name: "Atkinson Hyperlegible Next", data: fromDataUrl(atkinsonUrl) },
];

function Key({
  children,
  cap = clack.key,
  skirt = clack.skirt,
  ink = clack.ink,
  width = 76,
}: {
  children: string;
  cap?: string;
  skirt?: string;
  ink?: string;
  width?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: `${width}px`,
        height: "76px",
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: cap,
        color: ink,
        boxShadow: `0 6px 0 ${skirt}`,
        fontFamily: '"Unbounded", sans-serif',
        fontSize: "30px",
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function OgImage({ title }: { title: string }) {
  const size = title.length > 60 ? 54 : title.length > 32 ? 64 : 76;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 64px 64px",
        gap: "40px",
        backgroundColor: clack.plate,
        fontFamily: '"Atkinson Hyperlegible Next", sans-serif',
      }}
    >
      {/* The title is one big keycap. */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "40px 56px",
          borderRadius: "28px",
          backgroundColor: clack.key,
          boxShadow: `0 10px 0 ${clack.skirt}`,
        }}
      >
        <p
          style={{
            fontFamily: '"Unbounded", sans-serif',
            fontSize: `${size}px`,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: clack.ink,
          }}
        >
          {title}
        </p>
      </div>

      {/* Bottom row: the name in alpha keys, the domain on a mod key. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {"AGNEY".split("").map((letter, i) => (
            <Key
              key={`${letter}-${i}`}
              {...(i === 0
                ? {
                    cap: clack.accent,
                    skirt: clack.accentSkirt,
                    ink: clack.onMod,
                  }
                : {})}
            >
              {letter}
            </Key>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "76px",
            padding: "0 32px",
            borderRadius: "14px",
            backgroundColor: clack.mod,
            color: clack.onMod,
            boxShadow: `0 6px 0 ${clack.modSkirt}`,
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          agney.dev
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET({ request }) {
        const url = new URL(request.url);
        const title = url.searchParams.get("title") ?? "Agney";

        try {
          return new ImageResponse(<OgImage title={title} />, {
            width: 1200,
            height: 630,
            headers: {
              "Cache-Control": "public, immutable, max-age=31536000",
            },
            fonts,
          });
        } catch {
          return new Response("Failed to generate image", {
            status: 500,
          });
        }
      },
    },
  },
});
