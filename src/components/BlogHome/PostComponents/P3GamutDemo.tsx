import { useEffect, useState } from "react";

interface GamutColor {
  label: string;
  hue: string;
  p3: string; // OKLCH value that exceeds sRGB — renders full P3 where supported
  srgb: string; // OKLCH value clamped to sRGB max chroma at this L/H
}

const COLORS: GamutColor[] = [
  {
    label: "Cyan",
    hue: "185°",
    p3: "oklch(0.65 0.2 185)",
    srgb: "oklch(0.65 0.09 185)",
  },
  {
    label: "Red-Orange",
    hue: "25°",
    p3: "oklch(0.55 0.28 25)",
    srgb: "oklch(0.55 0.21 25)",
  },
  {
    label: "Purple",
    hue: "310°",
    p3: "oklch(0.5 0.35 310)",
    srgb: "oklch(0.5 0.29 310)",
  },
];

export function P3GamutDemo() {
  const [isP3, setIsP3] = useState<boolean | null>(null);

  useEffect(() => {
    setIsP3(window.matchMedia("(color-gamut: p3)").matches);
  }, []);

  return (
    <figure className="my-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-semibold">Your display:</span>
        {isP3 === null ? (
          <span className="text-secondary-muted text-sm">detecting…</span>
        ) : isP3 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
            Display P3 ✓
          </span>
        ) : (
          <span className="text-secondary-muted inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-800">
            sRGB only
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {COLORS.map((color) => (
          <ColorCard key={color.label} color={color} isP3={isP3} />
        ))}
      </div>

      <figcaption className="text-secondary-muted mt-4 text-sm">
        Each pair shows the same P3-capable OKLCH value (top) alongside its
        sRGB-clamped equivalent (bottom). On a P3 display, the top swatches are
        visibly more vivid - a color you cannot express in hex,{" "}
        <code>rgb()</code>, or <code>hsl()</code>. On sRGB, both rows look
        identical because the browser automatically gamut-maps the top value
        down.
      </figcaption>
    </figure>
  );
}

const SWATCH_STYLE: Record<string, string> = {
  borderRadius: "0.75rem",
  cornerShape: "squircle",
};

function ColorCard({
  color,
  isP3,
}: {
  color: GamutColor;
  isP3: boolean | null;
}) {
  return (
    <div className="border-primary/10 bg-surface not-prose rounded-xl border p-4">
      <h4 className="mb-3 text-sm font-semibold">
        {color.label}{" "}
        <span className="text-secondary-muted font-normal">
          (H={color.hue})
        </span>
      </h4>

      {/* P3 swatch — renders full P3 where supported, auto-clamped on sRGB */}
      <div className="flex flex-col gap-y-3">
        <div
          className="h-10 w-full border-2 border-black/10 dark:border-white/10"
          style={{ ...SWATCH_STYLE, backgroundColor: color.p3 }}
        />
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            <code className="bg-secondary/10 rounded px-1 py-0.5 text-[11px]">
              {color.p3}
            </code>
          </p>
          <p className="text-secondary-muted mb-4 text-[11px] leading-tight">
            P3-enhanced -{" "}
            {isP3 ? " visible on your display" : " auto-clamped on sRGB"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-primary/10 mb-4 border-t" />

      {/* sRGB-clamped swatch — always looks the same */}
      <div className="flex flex-col gap-y-3">
        <div
          className="h-10 w-full border-2 border-black/10 dark:border-white/10"
          style={{ ...SWATCH_STYLE, backgroundColor: color.srgb }}
        />
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            <code className="bg-secondary/10 rounded px-1 py-0.5 text-[11px]">
              {color.srgb}
            </code>
          </p>
          <p className="text-secondary-muted text-[11px] leading-tight">
            sRGB best-effort - max chroma at this hue and lightness
          </p>
        </div>
      </div>
    </div>
  );
}
