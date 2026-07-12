import { createFileRoute } from "@tanstack/react-router";
import ImageResponse from "takumi-js/response";
import { googleFonts } from "takumi-js/helpers";

function OgImage({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        backgroundImage:
          "linear-gradient(135deg, oklch(0.984 0.003 247.858) 0%, oklch(0.962 0.018 272.314) 40%, oklch(0.930 0.033 272.788) 100%)",
        fontFamily: '"Work Sans", sans-serif',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          backgroundImage:
            "linear-gradient(90deg, oklch(0.511 0.230 276.966), oklch(0.680 0.158 276.935), oklch(0.585 0.204 277.117))",
        }}
      />

      {/* Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          padding: "64px 72px",
          backgroundColor: "oklch(1 0 0)",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <p
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "oklch(0.208 0.040 265.755)",
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </p>
        </div>

        {/* Bottom: author + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "oklch(0.511 0.230 276.966)",
            }}
          >
            Agney
          </p>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 400,
              color: "oklch(0.554 0.041 257.417)",
            }}
          >
            agney.dev
          </p>
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
            fonts: googleFonts([{ name: "Work Sans", weight: "100..900" }]),
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
